const express = require('express');

const errorMiddlewares = require('./middlewares/error');
const userRoute = require('./routes/user-route')
const todoRoute = require('./routes/todo-route')

const app = express()

app.use(express.json())

// handle feature user
app.use('/user', userRoute);

// handle feature todo
app.use('/todo', todoRoute)

app.use(errorMiddlewares);

app.listen(8888, () => console.log('server running on port 8888'));

// register, login, change-password
// /register => /user/register
// /login => /user/login
// /change-password => /user/change-password

// create, get, delete todo
// /create-todo => /todo POST
// /delete-todo => /todo/:idToDelete
// get-todo => /todo GET
