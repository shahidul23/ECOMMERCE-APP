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
    },
    authMail:{
        mail:process.env.MAIL_ID,
        pass:process.env.MP
    },
    cloudinary:{
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.API_KEY,
        sec_key:process.env.API_SEC
    }
};

module.exports = connect;