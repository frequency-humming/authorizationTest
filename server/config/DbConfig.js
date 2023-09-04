const {Pool} = require('pg');

const pool = new Pool ({
    user:process.env.USERDB,
    host:'localhost',
    database:process.env.DATABASE,
    password:process.env.PASSWORD,
    port:5432,
    max: 25, 
    connectionTimeoutMillis: 10000, 
    idleTimeoutMillis: 30000,
});


module.exports = pool;