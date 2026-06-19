const express = require('express');
const router = express.Router();
const User = require("../models/User");

//create user

router.post("/", async(req, res)=>{
    const user = new User(req.body);
    const saved = await user.save();
    res.status(201).json(saved);
});

//Get all users

router.get("/",async(req,res)=>{
    const users = await User.find();
    res.status(201).json(users);
})

//Get single User

router.get("/",async(req,res)=>{
    //console.log(req.params.id);
    const user = await User.findById(req.params.id);
    res.status(201).json(user)
})

//update user in api/users/:id
router.put("/:id", async(req,res)=>{
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(user);
})

// delete user

router.delete("/:id", async(req,res)=>{
    await User.findbyIdAndDelete(res.params.id);
    res.status(204);
});


module.exports = router;