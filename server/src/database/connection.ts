import knex from 'knex';
import path from 'path';

//CONEXAO COM O BANCO DE DADOS
const connection = knex ({
    client: 'sqlite3',
    connection:{
        filename: path.resolve(__dirname, 'database.sqlite'),
    },
});

export default connection;