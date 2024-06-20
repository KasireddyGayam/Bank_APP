const mysql=require("mysql");
const dotenv=require("dotenv").config()

const dbConnection=mysql.createConnection({
    database:process.env.DATABASE,
    user:process.env.DUSER,
    password:process.env.PASSWORD,
    port:process.env.DPORT,
    host:process.env.HOST
})

dbConnection.connect((err)=>{
    if(err)
        console.log("DB Connection Failure",err.message)
    else
    console.log("DB Connected")
})

module.exports=dbConnection;