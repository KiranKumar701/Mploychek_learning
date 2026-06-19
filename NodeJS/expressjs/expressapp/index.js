const express = require('express');
const app = express();

app.use((res,req,next)=>{
    console.log("request URL", req.url);
    next();
})

app.get("/about",(req,res)=>{
    res.status(200).send("Hello Express App");
})

app.post("/",(req,res)=>{
    res.status(200).send("Hello Express App!!!")
})
app.use((req,res,next)=>{
    res.status(404).send("404 not found")
})

app.listen(5000, ()=>{
    console.log("Server listening port 5000");
})