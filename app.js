const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser');
require('./config/db');
const app = express();

const userRouter = require('./routes/auth.route');
const { notFound, errorHandler } = require("./middlewares/errorHandler");


app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req, res)=>{
    res.status(200).send("hello world")
});

app.use("/api/user",userRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;