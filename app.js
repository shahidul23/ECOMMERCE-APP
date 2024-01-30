const express = require("express");
const cors = require('cors')
const bodyPaeser = require('body-parser');
require('./config/db');
const app = express();

const userRouter = require('./routes/auth.route')


app.use(cors());
app.use(bodyPaeser.urlencoded({extended:true}));
app.use(bodyPaeser.json());

app.get("/",(req, res)=>{
    res.status(200).send("hello world")
});

app.use("/api/user",userRouter);

app.use((req, res, next) =>{
    res.status(404).json({
        message:"Invalide Router",
        success:false,
    });
});
app.use((err, req, res, next) =>{
    res.status(500).json({
        message: "Internal server error",
        success:false,
        error:err
    });
});

module.exports = app;