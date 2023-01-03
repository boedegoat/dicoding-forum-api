# Forum API

## Setup

1. setup `.env`

    ```env
    # HTTP SERVER
    HOST=localhost
    PORT=5000

    # POSTGRES
    PGHOST=localhost
    PGUSER=
    PGDATABASE=forumapi
    PGPASSWORD=
    PGPORT=5432

    # TOKENIZE
    ACCESS_TOKEN_KEY=
    REFRESH_TOKEN_KEY=
    ACCCESS_TOKEN_AGE=
    ```

2. setup test database env

    ```json
    // config/database/test.json
    {
        "user": "",
        "password": "",
        "host": "localhost",
        "port": 5432,
        "database": "forumapi_test"
    }
    ```
