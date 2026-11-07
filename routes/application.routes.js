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

router.get('/',isSignedIn, async (req,res)=>{
    const allAppliedCats = await Application.find({applicant:req.session.user._id}).populate('cat')
    res.render('applications/my-applications.ejs',{cats: allAppliedCats})
})


router.get('/applications-requests',isSignedIn,async(req,res)=>{
    //first we need to find the cats that the user has listed for adoption
    const usersCats = await Cat.find({owner: req.session.user._id})
    
    //then we need to save the cats ids in an array using the map method
    const catIds = usersCats.map((cat)=>{
        return cat._id
    })
    
    //then we find applications for those cats
    const foundApplications = await Application.find({cat:{$in:catIds}}).populate('applicant').populate('cat')
    
    res.render('applications/application-requests.ejs',{applications: foundApplications})
})

router.get('/:applicationId',isSignedIn,async(req,res)=>{
    const foundApplication = await Application.findById(req.params.applicationId).populate('cat')
    res.render('applications/view-application.ejs',{application:foundApplication})
})




module.exports = router;
