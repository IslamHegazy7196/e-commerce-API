const express=require('express')
const app =express()


app.route('/',(req,res)=>{
    res.send('111111111')
})

const port=process.env.PORT ||5000

const start=async()=>{
    try {
        app.listen(port,()=>{console.log(`server is listening on port ${port}`)})
    } catch (error) {
        console.log(error)
    }
}
start()