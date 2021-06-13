var router = require('express').Router();

router.get('/users',(req,res)=>{
    // res.end("List of users");
    res.json({
        users : []
    })
})

module.exports = router;