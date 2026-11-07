const router = require("express").Router()
const Application = require('../models/Application')
const Cat = require('../models/Cat');
const isSignedIn = require("../middleware/is-signed-in");
const passUserToView = require('../middleware/pass-user-to-view')

router.get('/:catId/new',isSignedIn, async (req,res)=>{
    const foundCat = await Cat.findById(req.params.catId)
    res.render('applications/apply-to-adopt.ejs',{cat: foundCat})
})






module.exports = router;
