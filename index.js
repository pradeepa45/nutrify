var express = require('express');
var app = express();
var session = require('express-session');
var jwt = require('jsonwebtoken');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('public'));
// app.use(express.static('frontend/signs/build'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// const authRouter = require('./routes/auth');
// const todoRouter = require('./routes/todos');
// const adminRouter = require('./routes/admin');
// app.use('/auth', authRouter);
// app.use('/todos', todoRouter);
// app.use('/admin', isAdmin, adminRouter);

const indexRouter = require('./routes/index');
app.use('/bknd',indexRouter);

// var MongoDBStore = require('connect-mongodb-session')(session);
// var store = new MongoDBStore({
//     url: 'mongo://localhost:27017/connect_mongodb_session_test',
//     collection: 'mySessions'
// });

// app.use(session({
//     // store: store,
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false }
// }))

// store.on('error', function (error) {
//     console.log("error storing session",error);
// });

// const apiRouter = require('./routes/index');
// app.use('/be',apiRouter);

app.get('/', (req, res) => {
    res.render('main');
})

app.get('/home',(req, res)=>{
    console.log(req.headers);
    if(req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1];
        const userDetails = jwt.verify(token,'secret');
        console.log(userDetails);
        if(userDetails.name){
            const {name} = userDetails
            res.render(__dirname+'/views/home',{name});
        }
        else{
            res.sendStatus(401);
        }
    }
    else{
        res.sendStatus(401);
    }
})

// app.get('/home', (req, res) => {
//     console.log("session created : ", req.session.role);
//     if(req.session.name){
//         res.render('home',{name : req.session.name});
//     }
//     else{
//         res.sendStatus(401);
//     }
// })

const isAdmin = function (res, req, next) {
    if(req.session && req.session.role === 'ADMIN' ){
        next();
    }
    else{
        console.log("hello from ./index.js")
        req.sendStatus(401);
    }
    // next();
}

app.listen(3000, () => {
    console.log('Server is listening on port 3000 currently...')
});