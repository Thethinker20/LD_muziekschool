const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User's Atributes
const studentSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
}
);

const Admin = mongoose.model("Student", studentSchema);
module.exports = Admin;