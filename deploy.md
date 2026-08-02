ssh raagency@92.205.189.37

cd ~/apps/ra-agency
git pull --ff-only

sudo systemctl stop raagency
mv .next ".next.backup-$(date +%Y%m%d-%H%M%S)"
bun run build
sudo systemctl start raagency

systemctl is-active raagency
curl -I https://raagency.tech

--Если менялись зависимости, перед остановкой сервиса добавляем:--!

bun install --frozen-lockfile