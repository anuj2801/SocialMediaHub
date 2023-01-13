const mongoose= require('mongoose')
const app=require('./app')
const { connectDatabase } = require('./config/database')

mongoose.set('strictQuery', false); //just for closing deprecation warning in console at development phase

connectDatabase();

app.listen(process.env.PORT, ()=>{
    console.log(`server is running on PORT ${process.env.PORT}`)
})