require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
// const Todo = require('./models/Todo').Todo;
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({ error: 'Invalid Object ID provided' });
    }

    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send({ error: 'Document not found' });
        }

        res.send({ todo });
    }, (e) => {
        res.status(400).send({ error: 'Find request failed' })
    });
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({ error: 'Invalid Object ID provided' });
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send({ error: 'Document not found' });
        }

        res.send({ todo });
    }, (e) => {
        res.status(400).send({ error: 'Delete request failed' })
    });
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);  // pick just the properties off the object we want users to update

    if(!ObjectID.isValid(id)) {
        return res.status(404).send({ error: 'Invalid Object ID provided' });
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // set the text, completed, and completedAt properties for the todo
    // return the updated todo back
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };