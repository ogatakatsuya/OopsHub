# OopsHub
<img width="1000" alt="Screenshot 2024-05-20 at 11 36 34" src="https://github.com/ogatakatsuya/OopsHub/assets/130939004/2b9e2579-86a6-40ec-8777-2660bad84f73">
<img width="1000" alt="Screenshot 2024-05-20 at 11 39 20" src="https://github.com/ogatakatsuya/OopsHub/assets/130939004/f7a2ba2d-971e-4f63-8ad2-217c7df87894">
<img width="541" alt="Screenshot 2024-05-19 at 15 19 58" src="https://github.com/ogatakatsuya/OopsHub/assets/130939004/62c605f7-e396-4f83-a4d7-5891c8eee10b">

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
