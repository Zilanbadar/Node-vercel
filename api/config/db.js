import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connect = async () => {
  mongoose.connect(
    "mongodb://localhost:27017/test",
    // { useNewUrlParser: true, useUnifiedTopology: true }
  );
};

let con = mongoose.connection;

con.once('open', () => {
  console.log('Connected to MongoDB');
});

con.on('error', (err) => {
  console.log(err);
});


export default connect;
