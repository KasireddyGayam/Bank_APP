const transporter=require("../configurations/mailsender.config");
const {authenticator}=require("otplib")

async function sendMail(to,subject,text){
    let otpStore={}
    try{
        const otp=authenticator.generate(process.env.OTP_SECRET)
        otpStore[to]=otp;
    let info=await transporter.sendMail({
        from:process.env.MAIL,
        to:to,
        subject:subject+"\n"+otp,
        text:text
    })
    console.log(`message sent with id ${info.messageId}`)
    console.log("OTP "+otp)
    return otpStore;
}
catch(err)
{
    console.error(err.message)
}
}

// console.log(otpStore)

module.exports={sendMail};