const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User's Atributes
const advencedU18Schema = new mongoose.Schema({
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

advencedU18Schema.statics.isThisStudentExist = async function(student){
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

const AdvencedU18 = mongoose.model("AdvencedU18", advencedU18Schema);
module.exports = AdvencedU18;