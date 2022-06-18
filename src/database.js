const mongoose = require("mongoose");

const {mongo} = require("./config");

mongoose
.connect(mongo.uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(db => {
    console.log("Succesfull");
}).catch(err =>{
    console.log(`Failed: ${err}`);
});