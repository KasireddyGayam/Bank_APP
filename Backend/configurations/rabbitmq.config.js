const amqp=require("amqplib");
const dotenv=require("dotenv").config();

var channel,connection;
const exchange_name="direct_exchange";
const exchange_type="direct";

async function connectToRabbit(message)
{
    try{
    connection=await amqp.connect(process.env.R_URL);
    channel=await connection.createChannel();
    await channel.assertExchange(exchange_name,exchange_type,{durable:false})
    await channel.publish(exchange_name,"user",Buffer.from(message))
    console.log("Message sent To Excahnge")
    return channel;
    }
    catch(err)
    {
        console.log(err.message)
    }
}

module.exports=connectToRabbit;