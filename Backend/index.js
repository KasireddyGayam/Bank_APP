const express = require('express')
const app = express()
const dotenv=require("dotenv").config()
const bodyParser=require("body-parser")
const routes=require("./routes/user.routes")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use("/user",routes)
const port = process.env.PORT
app.listen(port, () => console.log(`Bank App listening on port ${port}!`))