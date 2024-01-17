const mongoose= require("mongoose");


mongoose.connect('mongodb://localhost:27017/Raman');

const db=mongoose.connection

db.on("error",(err)=>{
     console.log(err);
})
db.once("open",()=>{
     console.log("connect with database sucessfully");
})