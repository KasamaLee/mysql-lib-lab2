const express = require('express');
const mysql2 = require('mysql2/promise')

const db = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Tk_10175560',
    database: 'mysql_todo_list',
    connectionLimit: 20
});

const app = express()

app.use(express.json())

// ### Login ###
// Method: post, Path: /login
// Data: username, password (REQUEST BODY)
app.post('/login', async (req, res, next) => {

    try {
        // # READ BODY
        const { username, password } = req.body;
        // # FIND user with username and password
        const result = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (result[0].length === 0) {
            return res.status(400).json({ message: 'invalid username or password' });
        }
        res.status(200).json({ message: 'success login' });

    } catch (err) {
        res.status(500).json({ message: 'internal server error' });
    }
})



// BODY, QUERY, PARAMETER
// ### Register ###
// Method: post, Path: '/register'
// Data: username, password
app.post('/register', async (req, res, next) => {
    try {

        // res.json({ message: 'REGISTER' })
        const { username, password } = req.body;

        // ## Validate Data : password must contain at least one uppercase

        // find exist username
        const result = await db.query('SELECT * FROM users WHERE username = ?', [username])
        console.log(result);
        if (result[0].length > 0) {
            return res.status(400).json({ message: 'username is already in use' })
        }


        // # Validate Fail
        // res.status(400).json({ message: 'password must contain at least one uppercase' });
        // ## END Validate

        // ## Save Data to Database
        // # mysql2 Connect to Mysql server and persist Data to user table

        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        res.status(201).json({ message: 'Success registration' })

    } catch (err) {
        res.status(500).json({ message: 'internal server error' })
    }
})

// ### Change Password ###
// Method: put, Path: /change-password
// Data: username
app.put('/change-password', async (req, res, next) => {
    try {
        // READ BODY
        const { username, newPassword } = req.body;

        // VALIDATE : username exist ?
        const result = await db.query('SELECT * FROM users WHERE username = (?)', [username]);
        console.log(result);
        if (result[0].length === 0) {
            // #username not exist
            return res.status(400).json({ message: 'username not found' })
        }
        // #username exist
        await db.query('UPDATE users SET password = (?) WHERE username = (?)', [newPassword, username]);
        res.status(200).json({ message: 'success update password' });

    } catch (err) {
        res.status(500).json({ message: 'internal server error' })
    }
})

// ### Create todo ###
// Method: post, Path: /create-todo
// Data: title, userId, completed
app.post('/create-todo', async (req, res, next) => {
    try {
        // READ BODY
        const { title, completed, userId } = req.body;

        // VALIDATE
        const result = await db.query('INSERT INTO todos (title, completed, user_id) VALUES(?, ?, ?)', [title, completed, userId])
        res.status(200).json({ message: 'create todo successfully' });

    } catch (err) {
        res.status(500).json({ message: 'internal server error' })
    }
})

// GET todo
// Method: get, Path: /get-todo
// Data: searchTitle, userId (QUERY)
app.get('/get-todo', async (req, res, next) => {
    try {
        // #READ QUERY
        const { searchTitle, userId } = req.query;
        // console.log(searchTitle, userId);

        if (searchTitle !== undefined && userId !== undefined) {
            const result = await db.query('SELECT * FROM todos WHERE title = (?) AND user_id = (?)', [searchTitle, userId])
            return res.status(200).json({ resultTodo: result[0] })
        }
        if (searchTitle !== undefined) {
            const result = await db.query('SELECT * FROM todos WHERE title = (?)', [searchTitle]);
            return res.status(200).json({ resultTodo: result[0] })
        }
        if (userId !== undefined) {
            const result = await db.query('SELECT * FROM todos WHERE user_id = (?)', [userId])
            return res.status(200).json({ resultTodo: result[0] })
        }
        const result = await db.query('SELECT * FROM todos')
        res.status(200).json({ resultTodo: result[0] })

    } catch (err) {
        res.status(500).json({ message: 'internal server error' })
    }
})

// ### Delete todo ###
// Method: delete, Path: /delete-todo/:idToDelete
// Data : idToDelete
app.delete('/delete-todo/:idTodoDelete', async (req, res, next) => {
    try {
        // READ PATH PARAMETER
        const { idTodoDelete } = req.params  // { idToDelete: 3 }

        // Find: is todo exist ?
        const result = await db.query('SELECT * FROM todos WHERE id = (?)', [idTodoDelete])
        console.log(result);
        
        if (result[0].length === 0) {
            return res.status(400).json({ message: 'todo with this ID not found' })
        }
        await db.query('DELETE FROM todos WHERE id = (?)', [idTodoDelete]);
        res.status(200).json({ message: 'delete successfully' })

    } catch (err) {
        res.status(500).json({ message: 'internal server error' })
    }
})


app.listen(8888, () => console.log('server running on port 8888'));
