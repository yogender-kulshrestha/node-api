const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const {Student, User, Blog, Comment} = require('../models/student');

router.get('/students',function(req,res,next){
    Student.find({roll: 'monitor'}).then(function(students){
        res.send(students);
    }).catch(next);
});

router.get('/students/:id',function(req,res,next){
    // Student.findOne({_id: req.params.id}).then(function(student){
    //     res.send(student);
    // }).catch(next);
    Student.findById(req.params.id).then(function(student){
        res.send(student);
    }).catch(next);
});

router.post('/students',function(req,res,next){
    Student.create(req.body).then(function(student){
        res.send(student);
    }).catch(next);
});

router.put('/students/:id',function(req,res,next){
    Student.findOneAndUpdate({_id: req.params.id},req.body).then(function(student){
        Student.findOne({_id: req.params.id}).then(function(student){
            res.send(student);
        });
    });
});

router.delete('/students/:id',function(req,res,next){
    Student.findOneAndDelete({_id: req.params.id}).then(function(student){
        res.send(student);
    });
});

router.get('/users', function (req, res, next) {
    var searchText = 'Text';
    User.find()
        .populate({
            path: "blogs",
            populate: {
                path: "comments", // in blogs, populate comments
                match: {text:  { $regex: '.*' + searchText + '.*' }}
            }
        }) // key to populate
        .then(user => {
            res.set('Access-Control-Allow-Origin', '*');
            res.json(user);
        });
});

router.get('/blogs', auth, function (req, res, next) {
    try {
        Blog.findOne()
       //  .populate("user", "-blogs")
       //  .populate("comments")
        .populate('myAuthor')
        /*.aggregate([
            { $lookup:
                    {
                        // ref: 'Comment',
                        from: 'comments',
                        localField: 'blog',
                        foreignField: 'id',
                        as: 'comments'
                    }
            },
        ])*/
        .then(blogs => {
            console.log("blog:- "+blogs);
            console.log("myAuthor:- "+blogs.myAuthor);
            // res.json(blogs);
            res.status(200).json({
                status: true,
                message: "Blog found successfully.",
                // total_count: blogs.length,
                blogs,
                // myAuth: blogs.myAuthor,
            });
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            error
        })
    }
});

// Register
router.post("/register", async (req, res) => {
    // Our register logic starts here
    try {
        // Get user input
        const { name, email, password } = req.body;

        // Validate user input
        if (!(email && password && name)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

// Login
router.post("/login", async (req, res) => {
    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

module.exports = router;