const router = require("express").Router()
const { application } = require("express");
const Cat = require('../models/Cat');
const isSignedIn = require("../middleware/is-signed-in");
const passUserToView = require('../middleware/pass-user-to-view')

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
        isNeutered:req.body.isNeutered,
        owner:req.session.user._id
    })
    res.redirect('/')
})

router.get('/', async (req,res)=>{
    const allCats = await Cat.find()
    res.render('cats/browse-cats.ejs',{cats: allCats})
})

router.get('/:catId', isSignedIn, async (req,res)=>{
    const foundCat = await Cat.findById(req.params.catId).populate('owner')
    res.render('cats/cat-details.ejs', {cats: foundCat})
})




module.exports = router;
