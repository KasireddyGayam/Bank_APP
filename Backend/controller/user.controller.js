const dbConnection = require("../configurations/db.config");
const connectToRabbit = require("../configurations/rabbitmq.config");
const {sendMail}=require("../controller/mail.controller")
const util=require("util");
const query=util.promisify(dbConnection.query).bind(dbConnection)
const client=require("../configurations/redis.config")
let otpStore={};

//---------------------------------------save user-----------------------------------
exports.create = async (req, res) => {
    try{
    const user = req.body;
    const sql=`insert into user set ?`;
    const result=await query(sql,user);
    const id=result.insertId;
    user.id=id;
    const message=JSON.stringify(user);
    await connectToRabbit(message);
   otpStore= await sendMail(user.email,'Welcome To HDFC BANK','OTP Authentication \n Here is Your OTP\n')
    return res.status(201).json({message:"User Has been saved",data:message,statusbar:true})
    }
    catch(err)
    {
        console.error(err.message)
        return res.status(500).json({error:err.message})
    }

}



//--------------------------------------fetch----------------------------------------

exports.fetch=async (req,res)=>{
    const email=req.params.email;
    const sql=`select * from user where email=?`;
    try{
    let result;
    const cached=await client.get(`user`);
    if(cached)
        {
            result=cached;
            return res.status(200).json({message:"User Found",data:result})
        }
        else {
            result=await query(sql,[email]);
            if(result.length>0){
            await client.setEx(`user`,3600,JSON.stringify(result));
            return res.status(200).json({message:"User Found",data:result})
            }
            return res.status(500).json({error:"No Data Found"})
        }

    }
    catch(err)
    {
        return res.status(500).json({error:err.message})
    }

}


//--------------------------------------------verify------------------------------------------------------

exports.verify=async (req,res)=>{
    const {email,otp}=req.body;
    console.log(otpStore)
    try{
    if(!email||!otp)
        {
            throw new Error("Email and OTP must be required");
        }
    if(!otpStore)
        {
            console.log(otpStore)
        throw new Error("Email Not Matched");
        }
    if(otp==otpStore[email].otp)
        {
            const result=await query(`update user set ? where email=?`,[{status:true},email])
            delete otpStore[email]
                return res.status(202).json({message:"User has been Verified",data:result})
        }
    }
    catch(err){
        return res.status(500).json({error:err.message})
    }
}