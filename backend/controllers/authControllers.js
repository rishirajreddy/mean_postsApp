const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async(req,res) => {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
        email: req.body.email,
        password: hashedPass
    })
    const user = await User.findOne({email: req.body.email});
    if(user){
        res.status(500).json({msg:"User already exists!!Try with different email"});
    }else {
        await newUser.save()
        .then(() => {
            console.log("User registered!!");
            res.status(200).json({
                msg:"User resgistered successfully!!",
                user: newUser
            })
        })
        .catch(err => {
            res.status(500).json({
                error:err
            })
            console.log(err);
        })
    }
}


exports.login = async(req,res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    try {
        if(!user) {
            res.status(404).json({msg:"Auth Failed!!User not found!!"})
        }else {
            const isCorrect = await bcrypt.compare(password, user.password) ;
            if(isCorrect) {
                let token = jwt.sign({email: user.email, userId: user._id}, 
                    "secret-long-key",
                    { expiresIn: '1h'}
                );
                res.status(200).json({
                    msg:"Logged In",
                    token:token,
                    expiresIn: 3600,
                    userId: user._id,
                    user: email
                })
            }else {
                res.status(401).json({
                    msg:"Incorrect password or email"});
                console.log("Login failed!!");
            }
        }
    }
    catch{
        res.status(500).json({error:err})
    }
}