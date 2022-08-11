const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User's Atributes
const beg18Schema = new mongoose.Schema({
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

beg18Schema.statics.isThisStudentExist = async function(student){
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

const BeginnerP = mongoose.model("Beginner+", beg18Schema);
module.exports = BeginnerP;