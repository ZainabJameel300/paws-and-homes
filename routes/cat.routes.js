const router = require("express").Router()
const { application } = require("express");
const Cat = require('../models/Cat');
const Application = require('../models/Application')
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


// some of this code is inspired by this youtube video as well as omar explnantion (https://www.youtube.com/watch?v=bZ_-v0MDMaY)
router.get('/', async (req, res) => {

    const gender = req.query.gender;
    const breed = req.query.breed;
    const age = req.query.age;

    //pagination
    const page = Number(req.query.page) || 1 // this reads the page number from the url if there's no page number then start with 1
    const limit = 8 //this is how many limit will the page have (how many cards per page)
    const skip = (page-1)*limit  // this tells us how many do we skip in the next pagination
    // this will be our query object (so like whenever the user selects a filter we add it in this object and then Moongoose excute all of these togather)
    let filter = {
        status: 'Available'
    };

    //  gender filter
    if (gender) {
        filter.gender = gender;
    }

    //  breed filter
    if (breed) {
        filter.breed = breed;
    }

    // age filter
    if (age === '1-5') {
        filter.age = { $gte: 1, $lte: 5 };
    }
    else if (age === '6-10') {
        filter.age = { $gte: 6, $lte: 10 };
    }
    else if (age === '11+') {
        filter.age = { $gte: 11 };
    }
    const allcats = await Cat.find(filter).populate('owner').skip(skip).limit(limit);

    const totalCats = await Cat.countDocuments(filter);

    const totalPages = Math.ceil(totalCats / limit);

    res.render('cats/browse-cats.ejs', {
        cats: allcats,
        gender: gender,
        breed: breed,
        age: age,
        currentPage: page,
        totalPages: totalPages
    });
});


router.get('/:catId', async (req,res)=>{
    const foundCat = await Cat.findById(req.params.catId).populate('owner')
    let hasApplied = false

    //this checks if the user has applied for that cat or not and send that value to the ejs file
    
    if(req.session.user){
        const exsistingApplication = await Application.findOne({
            cat:req.params.catId,
            applicant: req.session.user._id
        })

        if(exsistingApplication){
            hasApplied = true
        }
    }

    res.render('cats/cat-details.ejs', {cats: foundCat ,hasApplied})
})

router.get('/:userId/my-listings',isSignedIn,async(req,res)=>{
    const myListings = await Cat.find({owner:req.params.userId})
    res.render('cats/my-listing.ejs',{cats:myListings})
})

router.delete('/:catId/delete',isSignedIn, async(req,res)=>{
   await Cat.findByIdAndDelete(req.params.catId)
    res.redirect(`/cat/${req.session.user._id}/my-listings`)
})

router.get('/:catId/edit',isSignedIn, async (req,res)=>{
    const foundCat = await Cat.findById(req.params.catId)
    res.render('cats/edit-cat.ejs',{cat: foundCat})
})

router.put('/:catId',isSignedIn, async (req,res)=>{

    const updatedCat = await Cat.findByIdAndUpdate(req.params.catId,{
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
    },{new:true})
    
    res.redirect(`/cat/${req.params.catId}`)
})
router.post('/:catId/adopt', isSignedIn, async (req, res) => {

    await Cat.findOneAndUpdate(
        {
            _id: req.params.catId,
            owner: req.session.user._id,
            status: 'Available'
        },
        {
            status: 'Adopted'
        }
    );

    res.redirect(`/cat/${req.session.user._id}/my-listings`);

});




module.exports = router;
