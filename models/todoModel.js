var dbClient = require('mongodb').MongoClient;
var uniqid = require("uniqid");
const date = require('date-and-time');
// console.log(uniqid('meal-')); 

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'nodedb';


const createMeal = (meal, callback) => {
    try {
        dbClient.connect(url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            (err, client) => {
                if (err) {
                    return console.error("Error connecting to database")
                }
                const db = client.db(dbName);
                try {
                    console.log("from createMeal, todoModel", meal);
                    var newid = uniqid('mealId-')
                    var now = new Date();
                    var dateOnly = date.format(now, 'DD/MM/YYYY');
                    var timeOnly = date.format(now, 'hh:mm A [GMT]Z');
                    db.collection('meals').insertOne({
                        "meal_name": meal.mealName,
                        "cals": meal.calories,
                        "meal_id": newid,
                        "date": dateOnly,
                        "time": timeOnly
                    }, function (err, inserted) {
                        if (err) {
                            console.log("from createMeal, todoModel, error from meal insertion call back", err);
                            callback(null, {
                                success: false,
                                err
                            })
                        }
                        else {
                            console.log("from createMeal, todoModel,inserted a new meal", inserted.ops);
                            callback(null, {
                                success: true,
                                message: "inserted new meal",
                                meal_id: newid,
                            })
                        }
                    });

                }
                catch (err) {
                    console.error("error from inserting meal, todoModel", err);
                }
            }
        )
    }
    catch (err) {
        console.error(err);
        callback(err, null);
    }
}
module.exports.createMeal = createMeal;

const updateMeal = (mealId, newMeal, callback) => {
    // const {mealName} = meal;
    try {
        dbClient.connect(url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            (err, client) => {
                if (err) {
                    return console.err('Unable to connect to database')
                }
                const db = client.db(dbName);
                var now = new Date();
                var dateOnly = date.format(now, 'DD/MM/YYYY');
                var timeOnly = date.format(now, 'hh:mm A [GMT]Z');
                console.log(mealId.id);
                db.collection('meals').updateOne({
                    "meal_id": mealId.id
                }, {
                    $set: {
                        meal_name: newMeal.meal_name,
                        cals: newMeal.cals,
                        date: dateOnly,
                        time : timeOnly
                    }
                }, (err, update) => {
                    if (update.matchedCount) {
                        console.log("updated meal");
                        callback(null, {
                            success: true,
                            message : "updated successfully",
                            data : update.result
                        })
                    }
                    else if(err){
                        console.error(err);
                        callback(null, {
                            error : true,
                            message : err,
                            data : null
                        })
                    }
                    else{
                        console.log("meal id does not exist");
                        callback(null, {
                            error : true,
                            message : 'incorrect id',
                            data : null
                        })
                    }
                })
            }
        )
    }
    catch (err) {
        console.error("error connecting to database", err)
    }
}
module.exports.updateMeal = updateMeal;


const deleteMeal = (mealId, callback) => {
    try {
        dbClient.connect(url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            (err, client) => {
                if (err) {
                    return console.err('Unable to connect to database')
                }
                const db = client.db(dbName);
                console.log("look here", mealId.id);
                db.collection('meals').findOneAndDelete({
                    "meal_id": mealId.id
                }, (err, queryresult) => {
                    if (queryresult.lastErrorObject.n) {
                        // console.log(queryresult);
                        callback(null, {
                            success: true,
                            message: "meal deleted",
                            queryresult
                        })
                    }
                    // 
                    else {
                        console.error("meal not found re");
                        callback(null, {
                            success: false,
                            message: "no meal found"
                        })
                    }
                }
                )
            })
    }
    catch (err) {
        console.error("from deleteMeal, todoModel,error connecting to database", err)
    }
}
module.exports.deleteMeal = deleteMeal;


const ListMeals = (date, callback) => {
    try {
        dbClient.connect(url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            (err, client) => {
                if (err) {
                    return console.err('Unable to connect to database');
                }
                const db = client.db(dbName);
                // console.log("look here", date.id);
                db.collection('meals').find({date : date}).toArray(
                    (err, docs) =>{
                        if(docs){
                            console.log("meals found : \n",docs);
                            callback(null,{
                                success : true,
                                message : "meals found on date",
                                data : docs
                            })
                        }
                        else {
                            console.log("no meals found");
                            callback(null, {
                                error : true,
                                message : 'meals not found on date',
                                data : null
                            })
                        }
                    }
                )
            })
    }
    catch (err) {
        console.error("from ListMeal, todoModel,error connecting to database", err)
    }
}

module.exports.ListMeals = ListMeals;

