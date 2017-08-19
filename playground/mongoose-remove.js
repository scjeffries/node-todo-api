const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove({_id: '59989d7c2715f74991269edb'}).then((todo) => {
//     console.log(todo);
// });

Todo.findByIdAndRemove('59989d7c2715f74991269edb').then((todo) => {
    console.log(todo);
});