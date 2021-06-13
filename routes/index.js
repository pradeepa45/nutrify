var router = require('express').Router();
var express = require('express');
var app = express();
var jwt = require('jsonwebtoken')

const authRouter = require('./auth');
const todoRouter = require('./todos');
const adminRouter = require('./admin')

const isAdmin = function (res, req, next) {
    console.log("userDetails from isAdmin : ",req.req.userDetails);
    // next();
    if(req.req.userDetails.role === 'ADMIN'){
        console.log('access to admin : successful');
        next();
    }
    else{
        console.log(req.req.userDetails.role);
        res.sendStatus(401); 
    }
}

const verifyToken = function(req,res,next){
    if(req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1];
        const userDetails = jwt.verify(token,'secret');
        console.log("userDetails :",userDetails);
        if(userDetails.name){
            console.log("token verification sucessful");
            req.userDetails = userDetails;
            next();
        }
        else{
            console.log("token verification failed since theres no name")
            res.sendStatus(401);
        }
    }
    else{
        console.log("no req.headers")
        res.sendStatus(401);
    }
}

router.use('/auth', authRouter);
router.use('/todos', verifyToken, todoRouter);
router.use('/admin',verifyToken,isAdmin, adminRouter);

const Logger = function (req, res, next) {
    console.log(`[${new Date()}]: ${req.method} ${req.url}`);
    next();
}
router.use(Logger);

module.exports  = router;