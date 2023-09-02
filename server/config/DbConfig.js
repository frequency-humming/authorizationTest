const {Pool} = require('pg');
const http = require('http');

const pool = new Pool ({
    user:process.env.user,
    host:'localhost',
    database:process.env.database,
    password:process.env.password,
    port:5432
});

const eventData = async (req) => {
    let data = new Array();
    const username = req;
    console.log('here '+username);
    let client;

    try {
        client = await pool.connect();
        const result = await client.query('SELECT u.*, r.token AS refreshtoken FROM "user" u LEFT JOIN "refresh_tokens" r ON u.id = r.user_id WHERE u.username = $1', [username]);
        
        for (let row of result.rows) {
            console.log(row);
            data.push({
                Id: row.id,
                username: row.username,
                password: row.password,
                refreshtoken: row.refreshtoken
            });
        }
        return data[0];

    } catch (err) {
        console.error('Database error:', err);
        throw new Error('Error Retrieving Resources');
        
    } finally {
        if(client){
            client.release();
        }

    }
}

const refreshUserToken = async (req) => {
    let data = new Array();
    let client;

    try {
        client = await pool.connect();
        const result = await client.query('SELECT u.username FROM "refresh_tokens" r LEFT JOIN "user" u ON r.user_id = u.id WHERE r.token = $1', [req]);
        
        if (result.rows.length === 0) {
            console.log("No matching rows found");
            return false;
        }

        const row = result.rows[0];
        console.log(row);
        return { username: row.username};

    } catch (err) {
        console.error('Database error:', err);
        throw new Error('Error Retrieving Resources');
        
    } finally {
        if(client){
            client.release();
        }

    }
}

const storeToken = async (user) => {

    const refreshToken = user.refreshToken;
    const userId = user.Id;
    const browser = user.browser;
    let client;
    try {
        client = await pool.connect();
        const existingTokenRes = await client.query('SELECT * FROM refresh_tokens WHERE user_id = $1', [userId]);

        if (existingTokenRes.rows.length > 0) {
            result = await client.query('UPDATE refresh_tokens SET token = $1, browser = $2 WHERE user_id = $3', [refreshToken,browser,userId]);
        } else {
            result = await client.query('INSERT INTO refresh_tokens (user_id, token,browser) VALUES ($1, $2, $3)', [userId,refreshToken,browser]);
        }
        if (result.rowCount > 0) {
            return { success: true };
        } else {
            return { success: false, message: 'No rows were affected.' };
        }
    } catch (error) {
        console.error('Error storing refresh token:', error);
        return { success: false, error: error.message };
    } finally {
        if(client){
            client.release();
        }

    }

}

const duplicateUsers = async (user,email) => {

    let client;
    try {
        client = await pool.connect();
        const existingUser = await client.query('SELECT username FROM "user" WHERE username = $1 OR email = $2', [user,email]);

        if(existingUser.rows.length > 0){
            if(existingUser.rows[0].username === user){
                return { found: true, basedOn: 'Username' };
            }else{
                return { found: true, basedOn: 'Email' };
            }
        }else {
            return false;
        }
    }catch(error){
        console.error('Error retrieving user:', error);
        return { success: false, error: error.message };
    } finally {
        if(client){
            client.release();
        }
    }
}

const createUser = async (user,pwd,email) => {

    let client;
    try {
        client = await pool.connect();
        const existingUser = await client.query('INSERT INTO "user" (username,password,email) VALUES ($1, $2, $3)', [user,pwd,email]);
        if(existingUser.rowCount > 0){
            return true;
        }else {
            return false;
        }
    }catch(error){
        console.error('Error creating user:', error);
        throw new Error('Error creating user');
    } finally {
        if(client){
            client.release();
        }
    }
    
}


module.exports = {eventData,storeToken,duplicateUsers,createUser,refreshUserToken};