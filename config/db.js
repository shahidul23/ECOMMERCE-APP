const mongoose = require('mongoose');
const config = require('./config');

const url = config.db.dbUrl;
mongoose.connect(url)
.then(() =>{
    console.log('Databases is connected');
})
.catch((err) =>{
    console.log(err);
    process.exit(1);
})