require('dotenv').config();
const express= require("express");
const ejs= require("ejs");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const encrypt= require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useUnifiedTopology:true});
 
const userSchema = new mongoose.Schema({
    email:String,
    password: String
});

const secret=process.env.SECRET;

userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});//only encrypt password
//make sure to write this encrypt plugin before making the model as
//the model contains userSchema as a parameter

const User= mongoose.model("User", userSchema);

app.get("/",function(req, res){
    res.render("home");
});

app.get("/register",function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
   
   const newUser= new User({
       email: req.body.username,
       password:req.body.password
   });
 
   newUser.save(function(err){
       if(err){
           console.log(err);
       }else{
           res.render("secrets");
           console.log("New user data stored successfully!");
       }
   });
});

app.get("/login",function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
    const username= req.body.username;
    const password= req.body.password;

    User.findOne({email:username}, function(err,foundUser){
        //here we will return the details of the found user
        if(err){
            console.log(e);
        }else{
            if(foundUser){
                //if the user exists, then check his password 
                //with the one posted during login
                if(foundUser.password===password){
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000, function(){
    console.log("Server running at port 3000");
});