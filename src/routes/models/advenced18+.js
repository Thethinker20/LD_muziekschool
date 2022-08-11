const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User's Atributes
const advencedP18Schema = new mongoose.Schema({
  student: {
    type: String,
    required: true,
  },
  land: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}
);

advencedP18Schema.statics.isThisStudentExist = async function(student){
  if(!student) throw new Error("Invalid student id!");
  try{
    const user = await this.findOne({student})
    if(user) return false

    return true;
  }catch(e){
    console.log('Error inside isThisStudentExist method', e.message);
    return false;
  }
}

const AdvencedP18 = mongoose.model("AdvencedP18", advencedP18Schema);
module.exports = AdvencedP18;