# Деплой

```
ssh raagency@92.205.189.37
~/apps/ra-agency/scripts/deploy.sh
```

Всё. Скрипт сам подтягивает код, ставит зависимости (если менялись `package.json`
или `bun.lock`), собирает, перезапускает сервис и проверяет, что сайт отвечает.

Если нужно принудительно переустановить зависимости:

```
~/apps/ra-agency/scripts/deploy.sh --deps
```

## Что делает скрипт

1. Проверяет, что рабочее дерево чистое, и делает `git pull --ff-only`.
2. Ставит зависимости, если изменились `package.json` / `bun.lock`.
3. Собирает в отдельную папку `.next.build`, **пока старая версия продолжает
   работать**. Если сборка падает — сайт не трогается вообще.
4. Останавливает сервис на пару секунд, подменяет `.next`, запускает обратно.
5. Проверяет `https://raagency.tech`. Если сайт не поднялся за 20 секунд —
   автоматически откатывается на предыдущую сборку.
6. Хранит 3 последних бэкапа `.next.backup-*`, старые удаляет.

Права на запуск уже сохранены в git. Если всё же будет `Permission denied` —
один раз выполнить `chmod +x ~/apps/ra-agency/scripts/deploy.sh`.

## Если что-то пошло не так

```
sudo journalctl -u raagency -n 50 --no-pager   # логи сервиса
systemctl is-active raagency                   # статус
ls -1dt ~/apps/ra-agency/.next.backup-*        # доступные бэкапы
```

Ручной откат на предыдущую сборку:

```
cd ~/apps/ra-agency
sudo systemctl stop raagency
rm -rf .next && mv "$(ls -1dt .next.backup-* | head -1)" .next
sudo systemctl start raagency
```
frozen-lockfile