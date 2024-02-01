const mongoose = require('mongoose');

const validatedMongoseId = (id) =>{
    const isValide = mongoose.Types.ObjectId.isValide(id);
    if (!isValide) throw new Error("This id is not valide or not found");

}

module.exports = {validatedMongoseId}