const router = require("express").Router()
const { application } = require("express");
const Cat = require('../models/Cat');
const isSignedIn = require("../middleware/is-signed-in");


router.get('/new',isSignedIn,(req,res)=>{
    res.render('cats/list-cat.ejs')
})

router.post('/', isSignedIn, async (req,res)=>{
    const createdCatListing = await Cat.create({
        name: req.body.name,
        age:req.body.age,
        breed:req.body.breed,
        gender:req.body.gender,
        description:req.body.description,
        image:req.body.image,
        isVaccinated:req.body.isVaccinated,
        isNeutered:req.body.isNeutered
    })
    res.redirect('/')
})




module.exports = router;
