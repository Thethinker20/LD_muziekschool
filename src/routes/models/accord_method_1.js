const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User's Atributes
const begSchema = new mongoose.Schema({
  student: {
    type: String,
    required: false,
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

begSchema.statics.isThisStudentExist = async function(student){
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

const Beginner = mongoose.model("Beginner", begSchema);
module.exports = Beginner;