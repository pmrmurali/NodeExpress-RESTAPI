const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//@desc Register User
//@route POST /api/users/registerUser
//@access public

const registerUser = asyncHandler (async(req,res)=> {

 const {username,email,password} = req.body;
 if(!username || !email || !password)
 {
  res.status(400);
  throw new Error("All fields are mandatory");
 }
 
 const userAvailable = await User.findOne({email});
 
 if(userAvailable)
 {
  res.status(400);
  throw new Error("User Already Registered");
 }
 
 const hashPassword = await bcrypt.hash(password,10)
 console.log("Hash Password :",hashPassword);
 const user = await User.create({
 username,
 email,
 password : hashPassword,
 });
 console.log(`User Created ${user}`);
 if(user)
 {
  res.status(201).json({_id:user.id,email:user.email});
 }else
 {
  res.status(400);
  throw new Error("User data us not valid");
 }
 
});

//@desc Login User
//@route POST /api/users/login
//@access public

const loginUser = asyncHandler (async(req,res)=> {
const {email,password} = req.body;
if(!email || !password)
{
res.status(400);
throw new Error("All fields are mandatory");
}
console.log("jwt sign1");
const user = await User.findOne({email});
console.log("jwt sign2",user);
if(user && (await bcrypt.compare(password,user.password)))
{
 console.log("jwt sign3");
 const accessToken = jwt.sign(
 {
  user:{
   username: user.username,
   email: user.email,
   id: user.id,
  },
 },
  process.env.ACCESS_TOKEN_SECRET,
  {expiresIn: "15m"}
 );
 console.log(accessToken);
  res.status(200).json({accessToken});
}else
{
  res.status(401);
  throw new Error("email or password is not valid");
}
 
});

//@desc Current User
//@route GET /api/users/current
//@access private

const currentUser = asyncHandler (async(req,res)=> {
 console.log("Current  user");
 //const contacts = await Contact.find();
 //res.status(200).json(contacts);
 res.json(req.user);
});

module.exports = {registerUser,loginUser,currentUser}
