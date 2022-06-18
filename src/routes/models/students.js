const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User's Atributes
const studentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}
);

const Admin = mongoose.model("students", studentSchema);
module.exports = Admin;