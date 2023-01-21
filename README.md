# Forum API

## Setup

1. Setup `.env`

    ```env
    # HTTP SERVER
    HOST=
    PORT=

    # POSTGRES (production database)
    PGHOST=
    PGUSER=
    PGDATABASE=
    PGPASSWORD=
    PGPORT=

    # TOKENIZE
    ACCESS_TOKEN_KEY=
    REFRESH_TOKEN_KEY=
    ACCCESS_TOKEN_AGE=
    ```

2. Setup `config/database/test.json`

    This test database config is used for testing with jest

    ```json
    {
        "user": "",
        "password": "",
        "host": "",
        "port": 5432,
        "database": ""
    }
    ```

3. Install dependencies

    ```
    npm i
    ```

4. Migrate database

    ```
    npm run migrate:dev up

    # or runs on production database

    npm run migrate up
    ```

## Run

-   Test

    ```
    npm run test

    # or

    npm run test:dev:coverage

    # or runs on specific test file

    npm run test:dev:coverage -- <filename>.test.js
    ```

-   Dev server
    ```
    npm run dev
    ```
-   Production server
    ```
    npm start
    ```
