require('dotenv').config()
require('express-async-errors')
// basic server
const express=require('express')
const app =express()
const morgan=require('morgan')
// connect BD
const connectDB=require('./db/connect')
// require middlewares
const notFoundMiddleware=require('./middleware/not-found')
const errorHandlerMiddleware=require('./middleware/error-handler')
// basic route
app.use(express.json())
app.use(morgan('tiny'))

const authRouter=require('./routes/authRouter')

app.get('/',(req,res)=>{res.send('e-commerce-api')})
app.use('/api/v1/auth',authRouter)
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