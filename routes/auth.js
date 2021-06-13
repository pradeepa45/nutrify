var router = require('express').Router();
var authModel = require('../models/authModel');
var jwt = require('jsonwebtoken');

router.post('/signup',(req,res)=>{
    const user = req.body;
    authModel.createUser(user,(err,data)=>{
        if(err){
            res.json({
                error : true,
                data : null,
                message : "Sign up failed",
                possible_reason : err
            })
        }
        else if(data.success){
            res.render('home',data);
        }
    });
    
})

router.get('/signin',(req,res)=>{
    res.render('signin');
})

router.get('/signup',(req,res)=>{
    res.render('signup');
})

router.post('/signin',(req,res)=>{
    const user = req.body;
    authModel.verifyUser( user,(err,data)=>{
        if(err){
            res.json({
                error : true,
                data : null,
                message : "sign in failed"
            })
        }
        else{
            if(data.success){
                console.log(data);
                const token = jwt.sign({
                    email : data.email,
                    name : data.name,
                    role : data.role,
                }, 'secret')
                res.json({
                    success : true,
                    token,
                })
                // res.redirect('/home')
            }
            else{
                res.json(data);
            }
        }
    });
})

router.post('/signout', (req, res)=>{
    // req.session.destroy();
    // res.clearCookie('connect.sid');
    res.json({
        error : false,
        data : null,
        message : 'sign out successful'
    })
    res.render('/')
});

module.exports = router;