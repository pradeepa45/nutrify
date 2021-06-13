var passwordHash = require('password-hash');

const dbClient = require('mongodb').MongoClient;
var url = "./mydb";

const authModel = function async(user, callback) {
    // Get the documents collection
    try {
        const users = db.collection('users');
        // Insert some documents
        collection.insert([{ name: user.name, email: user.email, password: passwordHash.generate(user.password) }], function (err, result) {
            console.log('Added new user into the database', 'username: ', user.name, 'email: ', user.email, 'user.password: ', user.password, 'hashedpassword: ', passwordHash.generate(user.password));
            callback(result);
        });
    }catch(err){
        callback(err, null)
    }
}


module.exports = dbClient;