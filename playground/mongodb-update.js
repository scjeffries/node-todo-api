// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({_id: ObjectID("5993ac602715f74991268a68")},
    //                                         {$set: {completed: true}},
    //                                         {returnOriginal: false}).then((res) => {
    //     console.log(JSON.stringify(res, undefined, 2));
    // });

    db.collection('Users').findOneAndUpdate({_id: ObjectID("5993b34060a2cdd313d08072")},
                                            {$set: {name: 'Sco'}, $inc: { age: 1 }},
                                            {returnOriginal: false}).then((res) => {
        console.log(JSON.stringify(res, undefined, 2));
    });

    db.close();
});