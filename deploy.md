ssh raagency@92.205.189.37
cd ~/apps/ra-agency
git pull --ff-only
bun install --frozen-lockfile
sudo systemctl stop raagency
mv .next ".next.backup-$(date +%Y%m%d-%H%M%S)"
bun run build
sudo systemctl start raagency
systemctl is-active raagency
curl -I https://raagency.tech


cd ~/apps/ra-agency
git rev-parse --short HEAD
systemctl is-active raagency
curl -I https://raagency.tech

cd ~/apps/ra-agency
git pull --ff-only
bun install --frozen-lockfile

sudo systemctl stop raagency
mv .next ".next.backup-$(date +%Y%m%d-%H%M%S)"
bun run build

sudo systemctl start raagency
git rev-parse --short HEAD
systemctl is-active raagency
curl -I https://raagency.tech