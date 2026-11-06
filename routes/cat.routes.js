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
        location:{
          latitude:req.body.latitude,
          longitude:req.body.longitude,
          address:req.body.address
        },
        owner:req.session.user._id
    })
    res.redirect(`/cat/${req.session.user._id}/my-listings`)
})

router.get('/', async (req,res)=>{
    const allCats = await Cat.find().populate('owner')
    res.render('cats/browse-cats.ejs',{cats: allCats})
})

router.get('/:catId', async (req,res)=>{
    const foundCat = await Cat.findById(req.params.catId).populate('owner')
    res.render('cats/cat-details.ejs', {cats: foundCat})
})

router.get('/:userId/my-listings',async(req,res)=>{
    const myListings = await Cat.find({owner:req.params.userId})
    res.render('cats/my-listing.ejs',{cats:myListings})
})

router.delete('/:catId/delete', async(req,res)=>{
   await Cat.findByIdAndDelete(req.params.catId)
    res.redirect(`/cat/${req.session.user._id}/my-listings`)
})

router.get('/:catId/edit', async (req,res)=>{
    const foundCat = await Cat.findById(req.params.catId)
    res.render('cats/edit-cat.ejs',{cat: foundCat})
})

router.put('/:catId', async (req,res)=>{

    const updatedCat = await Cat.findByIdAndUpdate(req.params.catId, req.body)
    
    res.redirect(`/cat/${req.params.catId}`)
})




module.exports = router;
