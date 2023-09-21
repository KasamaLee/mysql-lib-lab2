const express = require('express');
const db = require('../database/db')
const createError = require('../utils/create-error')

const router = express.Router();

// ### Login ###
// Method: post, Path: /user/login
// Data: username, password (REQUEST BODY)
router.post('/login', async (req, res, next) => {

    try {
        // # READ BODY
        const { username, password } = req.body;
        // # FIND user with username and password
        const result = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (result[0].length === 0) {
            // return res.status(400).json({ message: 'invalid username or password' });
            return next(createError(400, 'invalid username or password'))
        }
        res.status(200).json({ message: 'success login' });

    } catch (err) {
        // res.status(500).json({ message: 'internal server error' });
       next(createError(500, 'internal server error'))
    }
})

// BODY, QUERY, PARAMETER
// ### Register ###
// Method: post, Path: '/user/register'
// Data: username, password
router.post('/register', async (req, res, next) => {
    try {
        // res.json({ message: 'REGISTER' })
        const { username, password } = req.body;

        // ## Validate Data : password must contain at least one uppercase
        // find exist username
        const result = await db.query('SELECT * FROM users WHERE username = ?', [username])
        console.log(result);
        if (result[0].length > 0) {
            // return res.status(400).json({ message: 'username is already in use' })
            return next(createError(400, 'username is already in use'))
        }

        // # Validate Fail
        // res.status(400).json({ message: 'password must contain at least one uppercase' });
        // ## END Validate

        // ## Save Data to Database
        // # mysql2 Connect to Mysql server and persist Data to user table

        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        res.status(201).json({ message: 'Success registration' })

    } catch (err) {
        // res.status(500).json({ message: 'internal server error' })
        next(createError(500, 'internal server error'))
    }
})

// ### Change Password ###
// Method: put, Path: /change-password
// Data: username
router.put('/change-password', async (req, res, next) => {
    try {
        // READ BODY
        const { username, newPassword } = req.body;

        // VALIDATE : username exist ?
        const result = await db.query('SELECT * FROM users WHERE username = (?)', [username]);
        console.log(result);
        if (result[0].length === 0) {
            // #username not exist
            // return res.status(400).json({ message: 'username not found' })
            return createError(400, 'username not found')
        }
        // #username exist
        await db.query('UPDATE users SET password = (?) WHERE username = (?)', [newPassword, username]);
        res.status(200).json({ message: 'success update password' });

    } catch (err) {
        // res.status(500).json({ message: 'internal server error' })
        createError(500, 'internal server error')
    }
})

module.exports = router;