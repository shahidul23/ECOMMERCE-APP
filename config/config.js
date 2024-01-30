require('dotenv').config();

const connect = {
    app:{
        port:process.env.PORT || 4000
    },
    db:{
        dbUrl:process.env.DB_URL
    },
};

module.exports = connect;