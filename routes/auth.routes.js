const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const {body, validationResult}= require('express-validator')

// Sign up validation rules
const signUpValidation = [

    body("email")
        .isEmail()
        .withMessage("Please enter a valid email address."),

    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required.")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long."),

    body("confirmPassword")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match.");
            }

            return true;
        }),

    body("phoneNumber")
        .notEmpty()
        .withMessage("Phone number is required.")
        .isMobilePhone("any")
        .withMessage("Please enter a valid phone number.")

];

// Sign in validation rules
const signInValidation = [

    body("username")
        .notEmpty()
        .withMessage("Please enter your username."),

    body("password")
        .notEmpty()
        .withMessage("Please enter your password.")

];

// Sign up routes
router.get("/sign-up", (req, res) => {
res.render("auth/sign-up.ejs" ,{
    values:{},
    errors:{}
});
});

router.post("/sign-up", upload.single("profilePhoto"),signUpValidation, async (req, res) => {

    const errors = validationResult(req);

if (!errors.isEmpty()) {
    return res.render("auth/sign-up.ejs", {
        errors: errors.mapped(),
        values: req.body
    });
}

    const userInDatabase = await User.findOne({
        username: req.body.username
    });

    if (userInDatabase) {
    return res.render("auth/sign-up.ejs", {
        errors: {
            username: {
                msg: "Username already taken."
            }
        },
        values: req.body
    });
}
const emailInDatabase = await User.findOne({
    email: req.body.email
});

if (emailInDatabase) {
    return res.render("auth/sign-up.ejs", {
        errors: {
            email: {
                msg: "Email is already registered."
            }
        },
        values: req.body
    });
}

    // Upload image to Cloudinary
    let profilePhoto = "";

    if (req.file) {
        const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            {
                folder: "paws-and-homes/profile-photos"
            }
        );

        profilePhoto = result.secure_url;
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // Create user
    await User.create({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
        phoneNumber: req.body.phoneNumber,
        profilePhoto: profilePhoto
    });

    res.redirect("/auth/sign-in",{
        values:{},
        errors:{}
    });
});

// Sign in routes
router.get("/sign-in", (req, res) => {
res.render("auth/sign-in.ejs" , {
    values:{},
    errors:{}
});
});

router.post("/sign-in", async (req, res) => {
// First, get the user from the database
const userInDatabase = await User.findOne({ username: req.body.username });
if (!userInDatabase) {
return res.send("Login failed. Please try again.");
}

// There is a user! Time to test their password with bcrypt
const validPassword = bcrypt.compareSync(
req.body.password,
userInDatabase.password
);
if (!validPassword) {
return res.send("Login failed. Please try again.");
}

// There is a user AND they had the correct password. Time to make a session!
// Avoid storing the password, even in hashed format, in the session
// If there is other data you want to save to req.session.user, do so here!
req.session.user = {
username: userInDatabase.username,
_id: userInDatabase._id,
profilePhoto:userInDatabase.profilePhoto
};

res.redirect("/");
});

router.get("/sign-out", (req, res) => {
req.session.destroy();
res.redirect("/");
});

module.exports = router;