const express=require("express")

  const {userRegister,userlogin}=require("../controller/userController")

const userRouter = express.Router();
// userRouter=app.use(express)


//registration

userRouter.post("/register",userRegister)
userRouter.post("/login",userlogin)



module.exports={
    userRouter
}
