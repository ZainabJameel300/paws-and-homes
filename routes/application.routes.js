const router = require("express").Router()
const Application = require('../models/Application')
const Cat = require('../models/Cat');
const isSignedIn = require("../middleware/is-signed-in");
const passUserToView = require('../middleware/pass-user-to-view')

router.get('/:catId/new',isSignedIn, async (req,res)=>{
    const foundCat = await Cat.findById(req.params.catId)
    res.render('applications/apply-to-adopt.ejs',{cat: foundCat})
})


router.post('/:catId',isSignedIn,async(req,res)=>{
    const alreadyApplied = await Application.findOne({
        cat:req.params.catId,
        applicant: req.session.user._id
    })

    if(alreadyApplied){
        return res.send("You Have Already Applied for this cat!")
    }

    const newApplication = await Application.create({
        cat:req.params.catId,
        applicant:req.session.user._id,
        message: req.body.message,
        livingSituation:req.body.livingSituation,
        experienceWithCats: req.body.experienceWithCats
    })
    res.redirect('/application')
})

router.get('/', async (req,res)=>{
    const allAppliedCats = await Application.find().populate('cat')
    res.render('applications/my-applications.ejs',{cats: allAppliedCats})
})





module.exports = router;
