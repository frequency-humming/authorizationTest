const pool = require('../config/DbConfig');

const loginUser = async (username) => {
    console.log('here '+username);
    let client;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT id,username,password FROM "user" WHERE username = $1', [username]);
        
        if(result.rows.length > 0){
            const row = result.rows[0];
            return {
                id: row.id,
                username: row.username,
                password: row.password,
            };
        }   
        return null;
    } catch (err) {
        console.error('Database error:', err);
        throw new Error('Error Retrieving Resources');
        
    } finally {
        if(client){
            client.release();
        }

    }
}

const refreshUserToken = async (token) => {
    
    let client;
    try {
        client = await pool.connect();
        const result = await client.query('SELECT u.username, u.id FROM "user" u INNER JOIN "refresh_tokens" r ON u.id = r.user_id WHERE r.token = $1',[token]);
        
        if (result.rows.length === 0) {
            console.log("No matching rows found");
            return false;
        }

        const row = result.rows[0];
        return { username: row.username,id: row.id};

    } catch (err) {
        throw new Error('Error Retrieving Resources');
        
    } finally {
        if(client){
            client.release();
        }

    }
}

const storeToken = async (user) => {
    const refreshToken = user.refreshToken;
    const userId = user.id;
    const browser = user.browser.toLowerCase().split(' ')[0];
    const system = user.system.toLowerCase().split(' ')[0];
    let client;
    try {
        client = await pool.connect();
        const existingTokenRes = await client.query('SELECT * FROM refresh_tokens WHERE user_id = $1 AND browser = $2 AND system = $3', [userId,browser,system]);

        if (existingTokenRes.rows.length > 0) {
            console.log('in update');
            result = await client.query('UPDATE refresh_tokens SET token = $1 WHERE user_id = $2', [refreshToken,userId]);
        } else {
            console.log('in insert');
            result = await client.query('INSERT INTO refresh_tokens (user_id, token,browser,system) VALUES ($1, $2, $3, $4)', [userId,refreshToken,browser,system]);
        }
        if (result.rowCount > 0) {
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (error) {
        throw new Error('Error storing token');
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
            return { found:false };
        }
    }catch(error){
        throw new Error('Error finding duplicate user');
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
        throw new Error('Error creating user');
    } finally {
        if(client){
            client.release();
        }
    }
}

const deleteToken = async (user) => {
    const userId = user.id;
    const browser = user.browser.toLowerCase().split(' ')[0];
    const system = user.system.toLowerCase().split(' ')[0];
    let client;
    try {
        client = await pool.connect();
        const result = await client.query('DELETE FROM refresh_tokens WHERE user_id = $1 AND browser = $2 AND system = $3', [userId,browser,system]);
        
        if (result.rowCount > 0) {
            return { success: true };
        } else {
            return { success: false };
        }   
    } catch (error) {
        throw new Error('Error Deleting Resources');
        
    } finally {
        if(client){
            client.release();
        }
    }
}

module.exports = {loginUser,storeToken,duplicateUsers,createUser,refreshUserToken,deleteToken};