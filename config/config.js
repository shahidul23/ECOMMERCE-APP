require('dotenv').config();

const connect = {
    app:{
        port:process.env.PORT || 4000
    },
    db:{
        dbUrl:process.env.DB_URL
    },
    jwt:{
        jwt_sec:process.env.JWT_SEC
    }
};

module.exports = connect;