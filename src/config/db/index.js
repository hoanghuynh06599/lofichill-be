const mongoose = require('mongoose');

const connect = async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log("Connect successfuly!!!")
    } catch (error) {
        console.error(error)
    }
}

module.exports = { connect }
