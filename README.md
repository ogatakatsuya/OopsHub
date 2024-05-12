# 環境構築
docker-compose.ymlがある階層で以下を実行

`docker compose up`

requirements.txtの変更やpackage.jsonの変更をイメージに反映させる時

`docker compose up --build`

docker-daemon is not runningが出た場合

docker desktopを起動する

backendで修正があったなら、
`python3 manage.py migrate`