import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongoDB.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middleware
app.use(express.json())
app.use(cors())


// API Endpoints
app.use('/api/user' ,userRouter)
app.use('/api/product', productRouter)

app.get('/',(req, res) =>{
    res.send("API Working")
})

app.listen(port, ()=>{console.log("Sever Started at PORT:"+ port)})
