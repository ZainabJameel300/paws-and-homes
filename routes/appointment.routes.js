const router = require("express").Router()
const Application = require('../models/Application')
const Cat = require('../models/Cat');
const Appointment = require('../models/Appointment')
const isSignedIn = require("../middleware/is-signed-in");
const passUserToView = require('../middleware/pass-user-to-view')


router.get('/new/:applicationId',isSignedIn,(req,res)=>{
    res.render('appointments/create-appointment.ejs',{application:req.params.applicationId})
})

router.post('/:applicationId', isSignedIn, async (req, res) => {

    const createdAppointment = await Appointment.create({
        application: req.params.applicationId,
        message: req.body.message,
        dateOfPickup: req.body.dateOfPickup,
        pickUpLocation: {
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            address: req.body.address
        }
    });

    res.redirect('/cat');

});

module.exports = router;
