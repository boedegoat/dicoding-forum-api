# Forum API

## Setup

1. Setup `.env`

    ```env
    # HTTP SERVER
    HOST=
    PORT=

    # POSTGRES
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

    > **Catatan**
    >
    > Gunakan database testing di local dan CI environment, database asli di production environment (e.g EC2 Instance)

2. Install dependencies and migrate database
    ```
    npm i
    npm run migrate up
    ```

## Run

-   Test
    ```
    npm run test
    # or
    npm run test:coverage
    ```
-   Dev server
    ```
    npm run dev
    ```
-   Production server
    ```
    npm start
    ```
