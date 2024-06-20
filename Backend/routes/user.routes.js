const express=require("express");
const userController=require("../controller/user.controller")

const router=express.Router();
router.post("/",userController.create);
router.get("/:email",userController.fetch)
module.exports=router;