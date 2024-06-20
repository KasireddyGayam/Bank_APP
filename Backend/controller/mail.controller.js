const transporter=require("../configurations/mailsender.config");
const otpStore={};
const {authenticator}=require("otplib")

async function sendMail(to,subject,text){
    try{
        const otp=authenticator.generate(process.env.OTP_SECRET)
        const expiry=Date.now()+parseInt(process.env.OTP_EXPIRY);
        otpStore[to]={otp,expiry}
    let info=await transporter.sendMail({
        from:process.env.MAIL,
        to:to,
        subject:subject+"\n"+otp,
        text:text
    })
    console.log(`message sent with id ${info.messageId}`)
    console.log("OTP "+otp)
}
catch(err)
{
    console.error(err.message)
}
}

module.exports={sendMail,otpStore};