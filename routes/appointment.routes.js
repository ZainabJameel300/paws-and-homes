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

// My Appointments
router.get('/', isSignedIn, async (req, res) => {

    const userApplications = await Application.find({
        applicant: req.session.user._id
    });

    const applicationIds = userApplications.map((application) => {
        return application._id;
    });

    const appointments = await Appointment.find({
        application: { $in: applicationIds }
    })
        .populate({
            path: 'application',
            populate: {
                path: 'cat',
                populate: {
                    path: 'owner'
                }
            }
        })
        .sort({ dateOfPickup: 1 });

    res.render('appointments/my-appointments.ejs', {
        appointments: appointments
    });
});


// View Appointment Details
router.get('/:appointmentId', isSignedIn, async (req, res) => {

    const foundAppointment = await Appointment.findById(req.params.appointmentId)
        .populate({
            path: 'application',
            populate: {
                path: 'cat',
                populate: {
                    path: 'owner'
                }
            }
        });

    if (!foundAppointment) {
        return res.send('Appointment not found');
    }


    res.render('appointments/view-appointment.ejs', {
        appointment: foundAppointment
    });
});


// Mark Appointment as Completed
router.post('/:appointmentId/complete', isSignedIn, async (req, res) => {

    const foundAppointment = await Appointment.findById(req.params.appointmentId)
        .populate('application');

    if (!foundAppointment) {
        return res.send('Appointment not found');
    }

    if (foundAppointment.application.applicant.toString() !== req.session.user._id.toString()) {
        return res.send('You are not allowed to update this appointment');
    }

    foundAppointment.status = 'Completed';
    await foundAppointment.save();

    res.redirect(`/appointment/${foundAppointment._id}`);
});


// Mark Appointment as Cancelled
router.post('/:appointmentId/cancel', isSignedIn, async (req, res) => {

    const foundAppointment = await Appointment.findById(req.params.appointmentId)
        .populate('application');

    if (!foundAppointment) {
        return res.send('Appointment not found');
    }

    if (foundAppointment.application.applicant.toString() !== req.session.user._id.toString()) {
        return res.send('You are not allowed to update this appointment');
    }

    foundAppointment.status = 'Cancelled';
    await foundAppointment.save();

    res.redirect(`/appointment/${foundAppointment._id}`);
});


module.exports = router;
