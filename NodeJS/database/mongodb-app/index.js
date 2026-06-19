const express = require('express');
const db = require("./db");
const app = express();
const User = require("./models/User");
const userRoutes = require("./routes/users");

app.use(express.json())
//user routes
app.use("/api/users",userRoutes)

app.listen(3000, ()=>{
    console.log("Server listening to http://localhost:3000")
});
