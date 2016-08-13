# API for Edoo Social
[![Known Vulnerabilities](https://snyk.io/test/github/tutv95/hapi/badge.svg)](https://snyk.io/test/github/tutv95/hapi)

# Config

Tạo file .env ở thư mục gốc.
Tạo database "Edoo"
 Ví dụ:

```
SERVER_ADDRESS=localhost
SERVER_PORT=2344
SERVER_KEY=com.fries

DB_HOST=localhost
DB_USER=root
DB_NAME=edoo
DB_PASSWORD=
DB_CHARSET=utf8
PATH_IMG_UPLOAD = /home/
```

# Init database

Chạy knex:
```
knex migrate:latest
knex seed:run
```
# seed dữ liệu class để test

```
node seedClasses.js
```

# Documentation API

Xem tại route /docs (UI) hoặc /docs.json (json)

## Note

Nếu cài bcrypt bị lỗi thì xem link này nhé:
https://github.com/nodejs/node-gyp

# Start server:

node index.js