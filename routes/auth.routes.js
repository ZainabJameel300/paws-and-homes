const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const {body, validationResult}=require('express-validator')

// Sign up routes

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs",{errors:null});
});

router.post(
  "/sign-up",

  // Validation rules (not empty , a valid format)
  [
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required.")
      .isEmail().withMessage("Please enter a valid email address."),

    body("username")
      .trim()
      .notEmpty().withMessage("Username is required."),

    body("password")
      .notEmpty().withMessage("Password is required.")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),

    body("confirmPassword")
      .notEmpty().withMessage("Please confirm your password.")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match.");
        }
        return true;
      }),

    body("phoneNumber")
      .trim()
      .notEmpty().withMessage("Phone number is required.")
      .isLength({ min: 8, max: 8 }).withMessage("Phone number must be 8 digits.")
      .isNumeric().withMessage("Phone number must contain only numbers.")
  ],

  async (req, res) => {

    // Check for validation errors: if there is no errors then redirect to the sign in page, else save the errors in an array
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("auth/sign-up.ejs", {
        errors: errors.array()
      });
    }

    // Check if username already exists
    const userInDatabase = await User.findOne({
      username: req.body.username
    });

    if (userInDatabase) {
      return res.render("auth/sign-up.ejs", {
        errors: [{ msg: "Username already taken." }]
      });
    }

    // Check if email already exists
    const emailInDatabase = await User.findOne({
      email: req.body.email
    });

    if (emailInDatabase) {
      return res.render("auth/sign-up.ejs", {
        errors: [{ msg: "Email already registered." }]
      });
    }

    // Check if phone number already exists
    const phoneInDatabase = await User.findOne({
      phoneNumber: req.body.phoneNumber
    });

    if (phoneInDatabase) {
      return res.render("auth/sign-up.ejs", {
        errors: [{ msg: "Phone number already registered." }]
      });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // Create the user
    await User.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      profilePhoto: req.body.profilePhoto
    });

    res.redirect("/auth/sign-in");
  }
);


// Sign in routes
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs",{errors:null});
});



router.post(
  "/sign-in",

  // Validation rules
  [
    body("username")
      .trim()
      .notEmpty().withMessage("Username is required."),

    body("password")
      .notEmpty().withMessage("Password is required.")
  ],

  async (req, res) => {

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("auth/sign-in.ejs", {
        errors: errors.array()
      });
    }

    // Find the user
    const userInDatabase = await User.findOne({
      username: req.body.username
    });

    if (!userInDatabase) {
      return res.render("auth/sign-in.ejs", {
        errors: [{ msg: "Login failed. Please try again." }]
      });
    }

    // Compare passwords
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );

    if (!validPassword) {
      return res.render("auth/sign-in.ejs", {
        errors: [{ msg: "Login failed. Please try again." }]
      });
    }

    // Create session
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    };

    res.redirect("/");
  }
);


router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/auth/sign-in");
});





module.exports = router;
