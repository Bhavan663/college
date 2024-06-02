 const User = require('../models/user')
 const {comparePassword, hashPassword} = require('../helpers/auth')
 const jwt = require('jsonwebtoken')
 

const test = (req,res) =>{
    res.json('test is working')
    
}


// register endpoint
const registerUser = async (req,res) =>{
    try {
        const {name,email,password} = req.body;
        // check if name is entered or not
        if(!name){
            return res.json({
                error: ' name is required'
            })
        };

        //check password
        if(!password || password.length < 6){
            return res.json({
                error: 'required 6 character password'
            })
        };
        // check email

        const exist = await User.findOne({email});
        if(exist){
            return res.json({
                error:'Email is taken already'
            })
        }

        const hashedPassword = await hashPassword(password)
        // create user in database
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })
        return res.json(user)
    } catch (error) {
        console.log(error)
    }
}
// login endpoint
const loginUser = async (req,res) =>{
    try {
        const {email,password} = req.body;
        //check if user exists

        const user = await User.findOne({email});
        if(!user){
            return res.json({
                error:'No user found'
            })
        }
        //check if password match
        const match = await comparePassword(password,user.password)
        if(match){
           jwt.sign({email: user.email, id: user._id, name:user.name}, process.env.JWT_SECRET , {},(err,token) =>{
            if(err) throw err;
            res.cookie('token',token).json(user)
           })
        }
        if(!match){
            res.json({
                error:'password do not match'
            })
        }
    } catch (error) {
        console.log(error)
    }
}   



module.exports = {
    test,
    registerUser,
    loginUser,
}