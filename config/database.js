const mongoose = require('mongoose')

module.exports = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB connected successfull.");
        
    } catch (error) {
        console.log("DB error", error);
        throw error
    }
}