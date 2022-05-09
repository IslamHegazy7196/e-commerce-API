require('dotenv').config()
require('express-async-errors')
// basic server
const express=require('express')
const app =express()
const morgan=require('morgan')
const cookieParser=require('cookie-parser')
// connect BD
const connectDB=require('./db/connect')
// require middlewares
const notFoundMiddleware=require('./middleware/not-found')
const errorHandlerMiddleware=require('./middleware/error-handler')
// basic route
app.use(express.json())
app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRET))
const authRouter=require('./routes/authRouter')
const userRouter=require('./routes/userRouter')

app.get('/',(req,res)=>{res.send('e-commerce-api')})
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port=process.env.PORT ||5000

const start=async()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port,()=>{console.log(`server is listening on port ${port}`)})
    } catch (error) {
        console.log(error)
    }
}
start()