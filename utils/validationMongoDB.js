const mongoose = require('mongoose');

const validatedMongooseId = (id) => {
    try {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
            throw new Error("This id is not valid or not found");
        }
        return true; // Id is valid
    } catch (error) {
        throw new Error("Invalid Id");
    }
}

module.exports = validatedMongooseId;