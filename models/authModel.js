var dbClient = require('mongodb').MongoClient;
var passwordHash = require('password-hash');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'nodedb';

const createUser = (user, callback) => {
    try {
        dbClient.connect(url,
            { useNewUrlParser: true, useUnifiedTopology: true },
            (err, client) => {
                if (err) {
                    return console.error('Unable to connect to database')
                }
                const db = client.db(dbName);
                try {
                    db.collection('users').insertOne({
                        "name": user.name,
                        "email": user.email,
                        "password": passwordHash.generate(user.password),
                        "calspd" : user.calories,
                    }, function (err, inserted) {
                        if (err) {
                            console.log("Error from insert call back", err);
                            callback(null, {
                                success: false,
                                err
                            })
                        }
                        else {
                            console.log("inserted from insert call back", inserted.ops);
                            console.log(user.name);
                            callback(null, {
                                success: true,
                                message: "new user signed up",
                                email: inserted.ops.email,
                                name: user.name
                            })
                        }
                    });

                }
                catch (err) {
                    console.error("Heads up!", err);
                    callback(null, {
                        success: false,
                        message: err
                    })
                }
            }
        );
    }
    catch (err) {
        console.error(err);
        callback(err, null);
    }
}
module.exports.createUser = createUser;

const verifyUser = ( user, callback) => {
    const { email, password } = user;
    try {
        dbClient.connect(url,
            { useNewUrlParser: true, useUnifiedTopology: true },
            (err, client) => {
                if (err) {
                    return console.error('Unable to connect to database')
                }
                const db = client.db(dbName);
                db.collection('users').findOne({
                    "email": email,
                }, (err, queryresult) => {
                    if (queryresult) {
                        if (passwordHash.verify(password, queryresult.password)) {
                            console.log("verified");
                            callback(null, {
                                success: true,
                                email: user.email,
                                name: queryresult.name,
                                role : (user.email==='admin@site' ? 'ADMIN' : 'CUST'),
                            })
                        }
                        else {
                            console.error("invalid password");
                            callback(null, {
                                success: false,
                                message: "Invalid password"
                            })
                        }
                        // console.log("qr",queryresult);
                        // console.log("user",user);
                    }
                    else {
                        console.error("User not found");
                        callback(null, {
                            success: false,
                            message: "invalid email address"
                        })
                    }
                });
                // console.log(insertion)
                // console.log("inserted a new user", user.name, user.email, user.password, passwordHash.generate(user.password));
            }
        );
    }
    catch (err) {
        console.error(err);
        callback(err, null);
    }
}

module.exports.verifyUser = verifyUser;
