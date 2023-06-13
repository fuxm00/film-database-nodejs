export default {
    debug: true,
    development: {
        client: 'sqlite3',
        connection: {
            filename: './mydb.sqlite',
        },
        useNullAsDefault: false,
        debug: true,
    },
    test: {
        client: 'sqlite3',
        connection: {
            filename: ':memory:',
        },
        useNullAsDefault: false,
        debug: true,
    },
}