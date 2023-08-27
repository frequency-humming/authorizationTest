const {Pool} = require('pg');
const http = require('http');

const pool = new Pool ({
    user:process.env.user,
    host:'localhost',
    database:process.env.database,
    password:process.env.password,
    port:5432
});

const eventData = (req) => {
    let data = new Array();
    const username = req;
    console.log('here');
    return new Promise((resolve,reject) => {
        pool.connect((err,client,release) => {
            if(err){
                return 'Error Connecting';
            }
            client.query('SELECT * FROM "User" WHERE username = $1', [username],(err,result) => {
                release();
    
                if(err){
                    return res.status(500).send('Error Retrieving Resources');
                }
                
                for(x in result.rows){ 
                    data.push({
                        Id:result.rows[x].Id,
                        username:result.rows[x].username,
                        password:result.rows[x].password,
                        refreshtoken:result.rows[x].refreshtoken,
                    })
                }
                console.log(data);
                resolve(data[0]);
            })
        })
    })
}


module.exports = {eventData};