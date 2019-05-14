const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const massive = require('massive');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

massive(process.env.CONNECTION_STRING)
    .then((dbInstance) => {
        console.log('db is connected')
        app.set('db', dbInstance)
    }) 
    .catch((err) => {
        console.log(`db not working ${err}`)
    });

app.get('/api/users', (req, res, next) => {
    const db = req.app.get('db');
    db.GET_USER()
        .then((users) => {
            console.log(users)
            res.send(users)
        })
})

app.get('/api/user', (req, res, next) => {
    const db = req.app.get('db');
    db.user_table.findOne({id: req.query.id})
        .then((users) => {
            res.send(users)
        })
})

app.post('/api/user', (req, res, next) => {
    const db = req.app.get('db');
    const {email, first_name, last_name, user_name, password} = req.body;
    db.user_table.insert({
        email,
        first_name,
        last_name,
        user_name,
        password
    })
        .then((user) => {
            res.send(user)
        })
})


const port = process.env.PORT || 8040;

app.listen(port, () => {
    console.log(`Humming on ${port}`)
})