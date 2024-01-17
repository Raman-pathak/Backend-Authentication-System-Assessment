const express = require('express');
const mongo = require('mongoose');
const bodyParser = require('body-parser');
const mongoose = require("./config/mongoose");
const userRoutes = require('./routes/userRouters');

const app = express();
const PORT = 3000


app.use(bodyParser.json());

app.get("/",(req,res) =>{
    res.send("hello welcome to you")
})

app.use("/",userRoutes);

//server 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

})
