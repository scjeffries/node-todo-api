const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// runs when a user signs up to encrypt their password
const password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
        // store in DB
    });
});

// runs when a user logs in
// fetched from DB via username/email
const hashedPassword = '$2a$10$JHuwlgWsa32gIr17MZZ7eOr0u3vkaZmtJA5eMBjsTpWt/y59XKQ62';

bcrypt.compare(password, hashedPassword, (err, res) => {  // res is true if passwords match
    console.log(res);
    // login if true, error otherwise
});

// var data = {
//     id: 10
// };
//
// const token = jwt.sign(data, '123abc');  // sent back to user upon sign up or login, gets stored in user token array
// console.log(token);
//
// const decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);

// const message = 'I am user number 3';
// const hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// const data = {
//     id: 4
// };
// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash) {
//     console.log("data was not changed");
// } else {
//     console.log("data was changed, don't trust");
// }