const nodemailer=require("nodemailer");

const transporter=nodemailer.createTransport({
    host:process.env.MHOST,
    port:process.env.MPORT,
    secure:false,
    auth:{
        user:process.env.MAIL,
        pass:process.env.MPASSWORD
    }
})

// console.log(transporter)

module.exports=transporter;