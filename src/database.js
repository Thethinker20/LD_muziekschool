const mongoose = require("mongoose");

const {mongo} = require("./config");

const uri = process.env.MONGODB_URI

mongoose
.connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(db => {
    console.log("Succesfull");
}).catch(err =>{
    console.log(`Failed: ${err}`);
});