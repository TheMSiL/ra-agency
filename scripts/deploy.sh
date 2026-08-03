#!/usr/bin/env bash
#
# Deploy ra-agency. Run it on the server from anywhere:
#
#   ~/apps/ra-agency/scripts/deploy.sh            # normal deploy
#   ~/apps/ra-agency/scripts/deploy.sh --deps     # force `bun install` first
#
# Dependencies are installed automatically when package.json or bun.lock changed
# in the pull, so --deps is only a manual override.
#
# The build runs into a scratch directory while the old one keeps serving, so a
# broken build leaves the live site untouched. The service is only stopped for
# the directory swap (a second or two), and is rolled back if it fails to answer.

set -euo pipefail

SERVICE="raagency"
HEALTH_URL="https://raagency.tech"
BUILD_DIR=".next.build"
KEEP_BACKUPS=3

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

FORCE_DEPS=0
for arg in "$@"; do
	case "$arg" in
		--deps|-d) FORCE_DEPS=1 ;;
		-h|--help) sed -n '3,13p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
		*) echo "Unknown option: $arg (try --help)" >&2; exit 2 ;;
	esac
done

step() { printf '\n\033[1;33m==> %s\033[0m\n' "$1"; }
fail() { printf '\n\033[1;31m!! %s\033[0m\n' "$1" >&2; exit 1; }

# ---------------------------------------------------------------- update code
# Only tracked changes matter: those are what a fast-forward pull would refuse or
# clobber. Stray untracked files (old backup dirs, typo'd filenames) are harmless.
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
	git status --short --untracked-files=no
	fail "Tracked files were modified on the server. Commit, stash or 'git checkout -- .' first."
fi

LOCK_BEFORE="$(git rev-parse HEAD:bun.lock HEAD:package.json 2>/dev/null || true)"

step "Pulling latest code"
git pull --ff-only

LOCK_AFTER="$(git rev-parse HEAD:bun.lock HEAD:package.json 2>/dev/null || true)"

if [ "$FORCE_DEPS" = 1 ] || [ "$LOCK_BEFORE" != "$LOCK_AFTER" ]; then
	step "Installing dependencies"
	bun install --frozen-lockfile
else
	echo "Dependencies unchanged, skipping install."
fi

# --------------------------------------------------- build without downtime
step "Building (site stays live)"
rm -rf "$BUILD_DIR"
# Reusing the previous build cache keeps the scratch build about as fast as an
# in-place one; without it every deploy would compile from scratch.
if [ -d ".next/cache" ]; then
	mkdir -p "$BUILD_DIR"
	cp -r ".next/cache" "$BUILD_DIR/cache"
fi

if ! NEXT_DIST_DIR="$BUILD_DIR" bun run build; then
	rm -rf "$BUILD_DIR"
	fail "Build failed. Nothing was changed — the old version is still serving."
fi

# ------------------------------------------------------------------- swap in
BACKUP=".next.backup-$(date +%Y%m%d-%H%M%S)"

step "Swapping in the new build"
sudo systemctl stop "$SERVICE"
if [ -d .next ]; then mv .next "$BACKUP"; fi
mv "$BUILD_DIR" .next
sudo systemctl start "$SERVICE"

rollback() {
	printf '\n\033[1;31m!! %s — rolling back\033[0m\n' "$1" >&2
	sudo systemctl stop "$SERVICE" || true
	rm -rf .next
	if [ -d "$BACKUP" ]; then mv "$BACKUP" .next; fi
	sudo systemctl start "$SERVICE"
	echo "Rolled back to the previous build. Check: sudo journalctl -u $SERVICE -n 50"
	exit 1
}

# ------------------------------------------------------------- health check
step "Checking the site"
for attempt in $(seq 1 10); do
	if curl -fsS -o /dev/null --max-time 5 "$HEALTH_URL"; then
		STATUS=ok
		break
	fi
	sleep 2
done

[ "${STATUS:-}" = ok ] || rollback "$HEALTH_URL did not answer after 20s"
systemctl is-active --quiet "$SERVICE" || rollback "$SERVICE is not active"

# --------------------------------------------------------- prune old builds
{ ls -1dt .next.backup-* 2>/dev/null || true; } | tail -n "+$((KEEP_BACKUPS + 1))" | xargs -r rm -rf

printf '\n\033[1;32m==> Deployed. %s is live.\033[0m\n' "$HEALTH_URL"
curl -sSI --max-time 5 "$HEALTH_URL" | head -1
