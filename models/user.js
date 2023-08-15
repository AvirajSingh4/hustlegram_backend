const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const UserModel=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
        }]
})

UserModel.pre('save',async function(next){
    if(this.isModified('password')){
    this.password=await bcrypt.hash(this.password,12)
    this.cpassword=await bcrypt.hash(this.cpassword,12)
    }
    next()
})

UserModel.methods.generateAuthToken=async function(){
    try{
    let token=await jwt.sign({_id:this._id},'process.env.SECRET_KEY')
    this.tokens=this.tokens.concat({token:token})
    await this.save()
    return token
    }catch(error){
        console.log(error)
    }
}

const User=mongoose.model('USERACCOUNT',UserModel)

module.exports=User