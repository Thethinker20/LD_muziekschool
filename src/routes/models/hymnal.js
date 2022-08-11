const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User's Atributes
const hynmalSchema = new mongoose.Schema({
  student: {
    type: String,
    required: true,
  },
  land: {
    type: String,
    required: false,
  },
  level2: {
    type: String,
    required: false,
    default: "nivel 1"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}
);

hynmalSchema.statics.isThisStudentExist = async function(student){
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

const Hynmal = mongoose.model("Hynmal", hynmalSchema);
module.exports = Hynmal;