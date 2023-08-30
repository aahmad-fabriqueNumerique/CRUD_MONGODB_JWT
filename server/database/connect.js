
const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        const connectionDB = await mongoose.connect(process.env.MONGODB_URL, {
            useNewURlParser: true,
            useUnifiedTopology: true, // to opt in to using the MongoDB driver's new connection management engine.
        })
        console.log(`Connected to MongoDB: ${connectionDB.connection.host}, DB is: ${connectionDB.connection.db.databaseName}`);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}


module.exports = connectDB;