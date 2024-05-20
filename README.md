# 要件定義等
https://www.figma.com/board/X4dV2zyQF0GhyDsRL1CjZf/Hackathon-vol5?node-id=9%3A345&t=LmbovPPepX7hz0F6-1

# 環境構築
docker-compose.ymlがある階層で以下を実行

`docker compose up`

requirements.txtの変更やpackage.jsonの変更をイメージに反映させる時

`docker compose up --build`

docker-daemon is not runningが出た場合

docker desktopを起動する

backendで修正があったなら、
`python3 manage.py migrate`
