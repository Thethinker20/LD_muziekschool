const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User's Atributes
const studentSchema = new mongoose.Schema({
  lang: {
    type: String,
    required: true,
  },
  ikben: {
    type: String,
    required: true,
  },
  username: {
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
  name: {
    type: String,
    required: true,
  },
  middlename: {
    type: String,
  },
  lastname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  telefoon: {
    type: String,
    required: true,
  },
  voorkennis: {
    type: String,
    required: true,
  },
  bereiken: {
    type: String,
    required: true,
  },
  traject: {
    type: String,
    required: true,
  },
  nemen: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: false,
    default: "Accord Method 1",
  },
  secondlevel: {
    type: String,
    required: false,
    default: "",
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

const student_neth = mongoose.model("Student_neth", studentSchema);
module.exports = student_neth;