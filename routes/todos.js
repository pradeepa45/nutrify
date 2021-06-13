var router = require('express').Router();
var todoModel = require('../models/todoModel');

router.get('/new', (req, res)=>{
    console.log("params from get req, todos new",req.body);
    res.render('meals');
})

router.post('/new',(req,res)=>{
    console.log('req to insert meal params from post req, todos new', req.body);
    // console.log(req.req.userDetails);
    const meal = req.body
    todoModel.createMeal(meal, (err,data)=>{
        if(err){
            res.json({
                error : true,
                data : null,
                message : "inserting meal failed",
                err,
            })
        }
        else if(data.success){
            res.json({
                error : false,
                data
            })
        }
    });
})

router.post('/update/:id',(req,res)=>{
    console.log("params from get req, todos update",req.params)
    console.log("body",req.body);
    todoModel.updateMeal(req.params,req.body,(err,data)=>{
        if(err){
            res.json({
                error : true,
                data : null,
                message : err
            })
        }
        else{
            res.json({
                error : false,
                data
            })
        }
    })
})



router.get('/delete/:id',(req,res)=>{
    console.log("params from get req, todos delete",req.params);
    todoModel.deleteMeal(req.params,(err,data)=>{
        if(err){
            res.json({
                error : true,
                data : null,
                message : "cannot delete meal"
            })
        }
        else{
            res.json({
                error : false,
                data
            })
        }
    })
})

router.get('/list/:date/:month/:year',(req, res) =>{
    console.log("params from get req, todos list", req.params);
    var date = req.params.date + '/' + req.params.month + '/' + req.params.year;
    console.log(date);
    // console.log("queries",req.query)
    todoModel.ListMeals(date, (err, data)=>{
        if(err){
            res.json({
                error : true,
                data : null,
                message : "no meals found"
            })
        }
        else{
            res.json({
                data
            })
        }
    })
})

module.exports = router;