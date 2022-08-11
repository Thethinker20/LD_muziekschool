const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User's Atributes
const studentPSchema = new mongoose.Schema({
  lang: {
    type: String,
    required: true,
  },
  ken: {
    type: String,
    required: true,
  },
  username_pap: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordC: {
    type: String,
    required: true,
  },
  name_pap: {
    type: String,
    required: true,
  },
  middlename_pap: {
    type: String,
  },
  lastname_pap: {
    type: String,
    required: true,
  },
  address_pap: {
    type: String,
    required: true,
  },
  bario: {
    type: String,
    required: true,
  },
  pastor: {
    type: String,
    required: false,
  },
  konosementu: {
    type: String,
    required: false,
  },
  meta: {
    type: String,
    required: true,
  },
  trajekto: {
    type: String,
    required: true,
  },
  iglesia: {
    type: String,
    required: true,
  },
  email_pap: {
    type: String,
    required: true,
  },
  age_pap: {
    type: String,
    required: true,
  },
  telefoon_pap: {
    type: String,
    required: true,
  },
  telefoon_emer: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: false,
    default: "Accord Method 1"
  },
  paid: {
    type: String,
    required: false,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}
);

const student_pap = mongoose.model("Student_pap", studentPSchema);
module.exports = student_pap;