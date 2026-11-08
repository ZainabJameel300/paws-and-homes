const router = require("express").Router();
const Cat = require('../models/Cat');

router.get('/', async (req, res) => {


    const allCats = await Cat.find({ status: 'Available' }).populate('owner');

    allCats.sort(() => Math.random() - 0.5);


    const featuredCats = allCats.slice(0, 4);

    res.render('homepage.ejs', {
        cats: featuredCats
    });
});

module.exports = router;