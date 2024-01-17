const express = require('express');
const router=express.Router();

const {register,verifytoken,home} = require("../controllers/UserController");

router.post("/register",register);
router.post("/verfity",verifytoken);
router.get("/home",home);

router.get("/demo",(req,res)=>{
      res.send("welcome my page")
})


module.exports=router;
