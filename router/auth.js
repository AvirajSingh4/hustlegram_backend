const express=require('express')
const router=express.Router()
const bcrypt=require('bcryptjs')
const User=require('../models/user')

/*router.get('/',(req,res)=>{
    res.send('router home page')
})*/

router.post('/register',async(req,res)=>{
    const{email,name,password,cpassword}=req.body
    if(!email||!name||!password||!cpassword){
        res.status(422).json({error:"Fill properly"})
    }
    try {
        const userExist=await User.findOne({email:email})
        if(userExist){
            res.status(422).json({error:"User already exist"})
        }
        else if(password!=cpassword){
            res.status(422).json({error:'Passwords do not match'})
        }
        else{
            const user=new User({email,name,password,cpassword})
            const userRegister=await user.save()
            if(userRegister){
                res.status(201).json({message:"db saved"})
            }
            else{
                res.status(500).json({error:"Error db save"})
            }
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/login',async(req,res)=>{
    try {
        let token
        const {email,password}=req.body     
        if(!email||!password){
            res.status(400).json({error:"Fill properly"})
        }

        const userExist=await User.findOne({email:email})

        if(userExist){
            const userMatch=await bcrypt.compare(password,userExist.password)
            token=await userExist.generateAuthToken()

            if(!userMatch){
                res.status(400).json({error:"User password didn't match"})
            }
            else{
                res.json({message:"Login success"})
            }
        }
        else{
            res.status(400).json({error:"fail signin"})
        }
    } catch (error) {
        console.log(error)
    }
    
})

router.get('/viewalluser', (req, res) => {
    User.find()
        .then(getsearchdocument => {
            res.status(200).send(getsearchdocument)
        } 
        )
        .catch(err => {
            return res.send({ message: "DB Problem..Error in Retriving with id " + req.params.empid });
        })
}
);

/*router.get('/searchuser/:eid', (req, res) => {
   try {
    
   } catch (error) {
    
   }
}
);*/

module.exports=router