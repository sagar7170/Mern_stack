const mongoose = require('mongoose');
const User = require("./User")
const express = require('express');
// const { response } = require('express');
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');
const multer = require('multer');
var cloudinary = require('cloudinary');
const cors = require('cors');
const cookie = require('cookie-parser')
const authentication = require("./authentication")


const app = express(); 
app.use(cors({ origin: true, credentials: true }))
app.use(express.json());
app.use(cookie());

cloudinary.config({ 
    cloud_name: "dvcwh1gaq",
    api_key: "862885473175857",
    api_secret: "11Weu7q8aczCXfsLqLK3RAw_K_Y",
    secure: true
  });
// app.get('/',(req,res)=>{
//     res.cookie('jwt',123);
//     res.send('hello')
// }) 

const db = `mongodb+srv://sagar:admin000@cluster0.hbxgpqx.mongodb.net/mernstack?retryWrites=true&w=majority`
mongoose.connect(db).then(() => {
    console.log("connected")
}).catch((err) => console.log(err));

const storage = multer.diskStorage({
    destination: './uploads', 
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  }) 
  var upload = multer({ storage: storage }) 
  
  app.post('/upload', upload.single('image'), async (req, res) => {  
  try{
    // const {url} = await cloudinary.uploader.upload(req.file.path);
    res.send(req.file);   
  }catch(err){  
      console.log(err);
  }
  });

// run()
// async function run(){
//     const user = await User.create({name: 'sagar' , email:'sagar@gmail.com' , phone : 879790901, work: 'homeloan'})
//     console.log(user) 
//     const f =  await User.find({name:'sagar'})
//     console.log(f);
// }

// const user = {
//     name: "sagar"
// }

// app.get('/user', (req, res) =>{
//     res.json(user)
//   }) 

// app.post('/register',(req,res) =>{
//     const {name, email, phone , work} = req.body;

//     if(!name || !email || !phone || !work){
//         return res.status(422).json({error: "plz fill the property"});
//     }

//     User.findOne({email : email})
//     .then((response)=>{
//         if(response){
//             return res.status(422).json({error: "email exist"})
//         }
//         const user = new User({name, email, phone, work});
//         user.save().then(()=>{
//             res.status(201).json({message: "user registered"});
//         }).catch((err) => res.status(500).json({error: "failed to register"}))
//     }).catch(err =>{console.log(err);});
//     console.log(req.body);
//     res.json(req.body);
// })

// app.get('/',(req,res)=>{ 
//     res.cookie("test","express");
//     res.send('hello express');
// }) 


app.post('/register', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;
    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "plz fill the property" });
    }
     
    try {
        const userexist = await User.findOne({ email: email })
        if (userexist) {
            res.status(422).json({ error: "Email already exist" })
        }
        else if (password != cpassword) {
            res.status(422).json({ error: "password and confirm_password not matching" })
        }
        else {
            const user = new User({ name, email, phone, work, password, cpassword });
            //pre
            await user.save();
            res.status(201).json({ message: "User registered scuccessfully." });
        }

    } catch (err) {
        console.log(err); 
    }
})

app.post('/signIn', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill the data" })
        }
        const userlogin = await User.findOne({ email: email });
        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            const token =  await userlogin.generateAuthToken();
            console.log("Jwt token is:",token);
        
            res.cookie("jwtoken",token,{
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Crediantials" });
            } else {
                res.json({ message: "user signIn succuessly" });
            }
        } 
        else {
            res.status(400).json({ error: "Invalid C rediantials" }); 
        }

    } catch (err) {
        console.log(err); 
    }
})
  
app.get('/about',authentication,(req,res)=>{
     res.send(req.rootUser)   
})
 

app.listen(4000)   