const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('./config/db');
const app = express();
const morgan = require('morgan')
const userRouter = require('./routes/auth.route');
const productRouter = require('./routes/product.route');
const blogRouter = require("./routes/blog.route");
const { notFound, errorHandler } = require("./middlewares/errorHandler");


app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'))

app.get("/",(req, res)=>{
    res.status(200).send("hello world")
});

app.use("/api/user",userRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter)

app.use(notFound);
app.use(errorHandler);

module.exports = app;