# API for Edoo Social

## Config

Tạo file .env ở thư mục gốc.
Tạo database "Edoo"
 Ví dụ:

```
SERVER_ADDRESS=localhost
SERVER_PORT=2344
SERVER_KEY=com.fries
SERVER_NAME=localhost

DB_HOST=localhost
DB_USER=root
DB_NAME=edoo
DB_PASSWORD=
DB_CHARSET=utf8

PATH_STATIC_FILE = /Users/TooNies1810/Downloads/upload-file
PATH_FILE_UPLOAD = /attach
PATH_EVENT_UPLOAD = /event
PATH_ZIP_TEMP = /zip-temp

SERVER_STATIC_FILES = localhost

API_FIREBASE_KEY = bla

API_KEY_SENDGRID = blabla
```

## Init database

Chạy knex:
```
knex migrate:latest
knex seed:run
```

## Create file OAuth2 Google config `client_secret.json` at root
```
{
  "installed": {
    "client_id": "",
    "project_id": "",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "",
    "redirect_uris": [
      "http://localhost:2344/oauthcallback"
    ]
  }
}
```

## Documentation API

https://docs.google.com/spreadsheets/d/1HvkoSS6OSoEWc6cfFKgmyFgaEji7WcQchsxgEdgELSI/edit?usp=sharing

## Note

- Set timzone cho server về UTC

## Start server:

```
npm start
```
