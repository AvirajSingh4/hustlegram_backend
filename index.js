const express=require('express')
const app=express()
const dotenv=require('dotenv')
const connectToMongo=require('./db')
const cors=require('cors')
const http=require('http')
const {Server}=require('socket.io')
//dotenv.config({path:'./config.env'})

const port=5000 || process.env.PORT 
connectToMongo()
app.use(cors())
app.use(express.json())
app.use(require('./router/auth'))


// app.get('/signup',(req,res)=>{
//     res.send('register')
// })
// app.get('/login',(req,res)=>{
//     res.send('login')
// })

const server=http.createServer(app)

const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
    }
})

io.on("connection",(socket)=>{
console.log(`User connected :${socket.id}`);

socket.on("join_room",(data)=>{
    socket.join(data)
    console.log(`User with ID : ${socket.id} joined room : ${data}`) 
})

socket.on("send_message",(data)=>{
    socket.to(data.room).emit("receive_message",data)
   
})

socket.on("disconnect",()=>{
    console.log("User disconnected",socket.id)
})

})


server.listen(5000,()=>{
    console.log(`http://localhost:${port}/`)
})