const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const exphbs = require("express-handlebars");
const http = require("http");
const https = require("https");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const Admin = require("./routes/models/admin");
const Student_neth = require("./routes/models/students_neth");
const Student_pap = require("./routes/models/students_pap");
const AccordMethod1 = require("./routes/models/accord_method_1");
const AccordMethod2 = require("./routes/models/accord_method_2");
const PianoSinger = require("./routes/models/singers");
const HynmalSkool = require("./routes/models/hymnal");
const PWSkool = require("./routes/models/p&w");
const fs = require("fs");



const app = express();
require("./database");
app.set("views", path.join(__dirname, "views"));

const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: path.join(app.get("views"), "layouts"),
  partialsDir: path.join(app.get("views"), "partials"),
  extname: ".hbs",
  helpers: {
    ifeq: function (a, b, options) {
      if (a == b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    ifnoteq: function (a, b, options) {
      if (a != b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    firstL: function (options) {
      return options.charAt(0);
    },
  },
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Middleware
app.use(morgan("tiny")); //Morgan
app.use(cors()); // cors
app.use(express.json()); // JSON
app.use(express.urlencoded({ extended: false })); //urlencoded
app.use(bodyParser.json());

const JWT_SECRET =
  'sdjkfh8923yhjdksbfmad3939&"#?"?#(#>Q(()@_#(##hjb2qiuhesdbhjdsfg839ujkdhfjk';


//login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username }).lean();

  if (username == "admin") {
    if (await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign(
        {
          id: admin._id,
          username: admin.username,
        },
        JWT_SECRET
      );
      res.json({ status: "ok", data: token });
    } else {
      res.json({ status: "404", error: "Incorrect password" });
    }
  } else if (username.substring(username.length - 3) == "326") {
    const stud_neth = await Student_neth.findOne({ username }).lean();

    if (await bcrypt.compare(password, stud_neth.password)) {
      const token = jwt.sign(
        {
          id: stud_neth._id,
          lang: stud_neth.lang,
          ikben: stud_neth.ikben,
          name: stud_neth.name,
          username: stud_neth.username,
          middlename: stud_neth.middlename,
          lastname: stud_neth.lastname,
          address: stud_neth.address,
          country: stud_neth.country,
          state: stud_neth.state,
          city: stud_neth.city,
          email: stud_neth.email,
          age: stud_neth.age,
          telefoon: stud_neth.telefoon,
          voorkennis: stud_neth.voorkennis,
          bereiken: stud_neth.bereiken,
          traject: stud_neth.traject,
          nemen: stud_neth.nemen,
          level: stud_neth.level,
        },
        JWT_SECRET
      );
      res.json({ status: "ok", data: token, paid:stud_neth.paid, lang: "neth" });
    } else {
      res.json({ status: "404", error: "Incorrect wachtwoord" });
    }
  } else if (username.substring(username.length - 3) == "495") {
    const username_pap = username;
    const stud_pap = await Student_pap.findOne({ username_pap }).lean();
    if (await bcrypt.compare(password, stud_pap.password)) {
      const token = jwt.sign(
        {
          id: stud_pap._id,
          lang: stud_pap.lang,
          ken: stud_pap.ken,
          username_pap: stud_pap.username_pap,
          name_pap: stud_pap.name_pap,
          middlename_pap: stud_pap.middlename_pap,
          lastname_pap: stud_pap.lastname_pap,
          address_pap: stud_pap.address_pap,
          bario: stud_pap.bario,
          pastor: stud_pap.pastor,
          konosementu: stud_pap.konosementu,
          meta: stud_pap.meta,
          trajekto: stud_pap.trajekto,
          iglesia: stud_pap.iglesia,
          email_pap: stud_pap.email_pap,
          age_pap: stud_pap.age_pap,
          telefoon_pap: stud_pap.telefoon_pap,
          telefoon_emer: stud_pap.telefoon_emer,
          level: stud_pap.level,
        },
        JWT_SECRET
      );
      res.json({ status: "ok", data: token, paid:stud_pap.paid, lang: "pap" });
    } else {
      res.json({ status: "404", error: "Password fout" });
    }
  } else {
    res.json({ status: "404", error: "Username does not exist!" });
  }
});

//register neth
app.post("/register_neth", async (req, res) => {
  const {
    lang,
    ikben,
    username,
    password: plainTextPassword,
    passwordC: plainTextPasswordC,
    name,
    middlename,
    lastname,
    address,
    country,
    state,
    city,
    email,
    age,
    telefoon,
    voorkennis,
    bereiken,
    traject,
    nemen
  } = req.body;

  const password = await bcrypt.hash(plainTextPassword, 10);
  const passwordC = await bcrypt.hash(plainTextPasswordC, 10);

  const find_user = await Student_neth.findOne({ email });

  if (find_user) {
    res.send({ status: 404, msg: "Student al in gebruik" });
  } else {
    try {
      const response = await Student_neth.create({
        lang,
        ikben,
        username,
        password,
        passwordC,
        name,
        middlename,
        lastname,
        address,
        country,
        state,
        city,
        email,
        age,
        telefoon,
        voorkennis,
        bereiken,
        traject,
        nemen,
      });

      // let transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: "cedafam.admi@gmail.com",
      //     pass: "CEDAFAM2021",
      //   },
      // });

      // const linkPortal = "https://saludmentalum.um.edu.mx/login";
      // let mailOption = {
      //   from: "cedafam.admi@gmail.com",
      //   to: `${email} ,cedafam.admi@gmail.com`,
      //   subject: "Confirmacion registro",
      //   html:
      //     "<h2>Bienvenido</h2><h5>Buendia has hecho un registro en Salud mental UM para tener un cita</h5><h5>En este link: " +
      //     linkPortal +
      //     " vas a poder subir a tu portal</h5><h5>Entra a este link con tu usuario y contraseña usuario: " +
      //     username +
      //     " contraseña: " +
      //     plainTextPassword +
      //     "</h5>",
      // };

      // transporter.sendMail(mailOption, function (err, data) {
      //   if (err) {
      //     console.log("Error Occurs", err);
      //   } else {
      //     console.log("Email sent");
      //     data.json({ status: "202", data: "Success" });
      //   }
      // });
    } catch (error) {
      if (error.code === 11000) {
        // duplicate key
        return res.json({ status: "402", error: "Gebruikersnaam al in gebruik" });
      }
      throw error;
    }
  }
});

//register pap
app.post("/register_pap", async (req, res) => {
  const {
    lang,
    ken,
    username_pap,
    password_pap: plainTextPassword,
    passwordC_pap: plainTextPasswordC,
    name_pap,
    middlename_pap,
    lastname_pap,
    address_pap,
    bario,
    pastor,
    konosementu,
    meta,
    trajekto,
    iglesia,
    email_pap,
    age_pap,
    telefoon_pap,
    telefoon_emer
  } = req.body;

  const password = await bcrypt.hash(plainTextPassword, 10);
  const passwordC = await bcrypt.hash(plainTextPasswordC, 10);

  try {
    const response = await Student_pap.create({
      lang,
      ken,
      username_pap,
      password,
      passwordC,
      name_pap,
      middlename_pap,
      lastname_pap,
      address_pap,
      bario,
      pastor,
      konosementu,
      meta,
      trajekto,
      iglesia,
      email_pap,
      age_pap,
      telefoon_pap,
      telefoon_emer
    });
    console.log("user create good: ", response);

    // let transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: "cedafam.admi@gmail.com",
    //     pass: "CEDAFAM2021",
    //   },
    // });

    // const linkPortal = "https://saludmentalum.um.edu.mx/login";
    // let mailOption = {
    //   from: "cedafam.admi@gmail.com",
    //   to: `${email} ,cedafam.admi@gmail.com`,
    //   subject: "Confirmacion registro",
    //   html:
    //     "<h2>Bienvenido</h2><h5>Buendia has hecho un registro en Salud mental UM para tener un cita</h5><h5>En este link: " +
    //     linkPortal +
    //     " vas a poder subir a tu portal</h5><h5>Entra a este link con tu usuario y contraseña usuario: " +
    //     username +
    //     " contraseña: " +
    //     plainTextPassword +
    //     "</h5>",
    // };

    // transporter.sendMail(mailOption, function (err, data) {
    //   if (err) {
    //     console.log("Error Occurs", err);
    //   } else {
    //     console.log("Email sent");
    //     data.json({ status: "202", data: "Success" });
    //   }
    // });

  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: "402", error: "Studiante ta existi kaba" });
    }
    throw error;
  }


  const studentId = Student_pap.findOne({ name_pap: name_pap });
  const AccordMethod1 =
  {
    student: studentId._id,
    land: "Curacao",
  }
  const student_exist = AccordMethod1.findOne({ student: AccordMethod1.student });
  const student = new AccordMethod1(AccordMethod1);
  student.save(function (err, change) {
    res.json({ status: "ok" });
  });

});

//portal
//admin get data neth
app.get("/get_students_neth", (req, res) => {
  Student_neth.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});
app.get("/get_students_pap", (req, res) => {
  Student_pap.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

//akord metohde 1
app.post("/acord_method_1", (req, res) => {
  const { country_name } = req.body;

  AccordMethod1.find({ land: { $in: country_name } })
    .then((result) => {
      var studentArray = [];
      for (var key in result) {
        var dataTest = result[key].student;
        studentArray = studentArray.concat(dataTest);
      };

      if (country_name == "Curacao") {
        Student_pap.find({ _id: { $in: studentArray } }, function (err, docs) {
          res.send({ data: docs });
        });
      } else {
        Student_neth.find({ _id: { $in: studentArray } }, function (err, docs) {
          console.log(docs);
          res.send({ data: docs });
        });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

//akord methode 2
app.post("/acord_method_2", (req, res) => {
  const { country_name } = req.body;

  AccordMethod2.find({ land: { $in: country_name } })
    .then((result) => {
      var studentArray = [];
      for (var key in result) {
        var dataTest = result[key].student;
        studentArray = studentArray.concat(dataTest);
      };

      if (country_name == "Curacao") {
        Student_pap.find({ _id: { $in: studentArray } }, function (err, docs) {
          res.send({ data: docs });
        });
      } else {
        Student_neth.find({ _id: { $in: studentArray } }, function (err, docs) {
          res.send({ data: docs });
        });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

//piano for singers
app.post("/get_piano_for_singers", (req, res) => {
  const { country_name } = req.body;

  PianoSinger.find({ land: { $in: country_name } })
    .then((result) => {
      var studentArray = [];
      for (var key in result) {
        var dataTest = result[key].student;
        studentArray = studentArray.concat(dataTest);
      };

      if (country_name == "Curacao") {
        Student_pap.find({ _id: { $in: studentArray } }, function (err, docs) {
          res.send({ data: docs });
        });
      } else {
        Student_neth.find({ _id: { $in: studentArray } }, function (err, docs) {
          res.send({ data: docs });
        });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

//hymnal skool
app.post("/get_hymnal_skol", (req, res) => {
  const { country_name } = req.body;

  HynmalSkool.find({ land: { $in: country_name } })
    .then((result) => {
      var studentArray = [];
      for (var key in result) {
        var dataTest = result[key].student;
        studentArray = studentArray.concat(dataTest);
      };

      if (country_name == "Curacao") {
        Student_pap.find({ _id: { $in: studentArray } }, function (err, docs) {
          res.send({ data: docs });
        });
      } else {
        Student_neth.find({ _id: { $in: studentArray } }, function (err, docs) {
          res.send({ data: docs });
        });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});
//p&w skool
app.post("/get_pw_skool", (req, res) => {
  const { country_name } = req.body;

  PWSkool.find({ land: { $in: country_name } })
    .then((result) => {
      var studentArray = [];
      for (var key in result) {
        var dataTest = result[key].student;
        studentArray = studentArray.concat(dataTest);
      };

      if (country_name == "Curacao") {
        Student_pap.find({ _id: { $in: studentArray } }, function (err, docs) {
          res.send({ data: docs });
        });
      } else {
        Student_neth.find({ _id: { $in: studentArray } }, function (err, docs) {
          res.send({ data: docs });
        });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

//change
app.post("/change_level", async (req, res) => {

  const { student_id, land, level, level2 } = req.body;

  const accordMethod1 =
  {
    student: student_id,
    land: land,
    level2: level2,
  }

  if (land == "Curacao") {
    //Curacao
    const student_cur = await Student_pap.findOne({ _id: student_id });
    const student_level = student_cur.level;

    if (student_level == "Accord Method 1") {
      if (level == "Accord Method 2") {
        const student_AccordMethod1P18 = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_AccordMethod1P18) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_pap.updateOne({_id:student_id}, { level: "Accord Method 2" });
          if(update_ex){
            const student = new AccordMethod2(AccordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }

        }
      } else if (level == "Piano for Singer") {
        const student_piano_singer = await PianoSinger.isThisStudentExist(student_id);
        if (!student_piano_singer) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_pap.updateOne({_id:student_id}, { level: "Piano for Singer" });

          if(update_ex){
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      }else if (level == "Hymnal Skool") {
        const student_hynmal_skool = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_hynmal_skool) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_pap.updateOne({_id:student_id}, { level: "Hymnal Skool" });
          if(update_ex){
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "P&W Skool") {
        const student_pw_skool = await PWSkool.isThisStudentExist(student_id);
        if (!student_pw_skool) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_pap.updateOne({_id:student_id}, { level: "P&W Skool" });
          if(update_ex){
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      }
    } //Accord Method 2s
    else if (student_level == "Accord Method 2") {
      if (level == "Accord Method 1") {
        const student_AccordMethod1 = await AccordMethod1.isThisStudentExist(student_id);
        if (!student_AccordMethod1) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_pap.updateOne({_id:student_id}, { level: "Accord Method 1" });
          if(updatesuc){
            const student = new AccordMethod1(accordMethod1);
              student.save(function (err, change) {
                res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({status: 404, msg: "Change not done!"})
          }
        }
      } else if (level == "Piano for Singer") {
        const student_exist = await PianoSinger.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_pap.updateOne({_id:student_id}, { level: "Piano for Singer" });
          if(updatesuc){
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({status: 404, msg: "Change not done!"})
          }
        }
      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_pap.updateOne({_id:student_id}, { level: "Hymnal Skool" });
          if(updatesuc){
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({status: 404, msg: "Change not done!"})
          }
        }
      } else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_pap.updateOne({_id:student_id}, { level: "P&W Skool" });
          if(updatesuc){
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({status: 404, msg: "Change not done!"})
          }
        }
      }
    }//Piano for singer
    else if (student_level == "Piano for Singer") {
      if (level == "Accord Method 1") {
        const student_exist = await AccordMethod1.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({_id:student_id}, { level: "Accord Method 1" });
          if(update_exist){
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Accord Method 2") {
        const student_exist = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({_id:student_id}, { level: "Accord Method 2" });
          if(update_exist){
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({_id:student_id}, { level: "Hymnal Skool" });
          if(update_exist){
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({_id:student_id}, { level: "P&W Skool" });
          if(update_exist){
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      }
    }//Hymnal Skool
    else if (student_level == "Hymnal Skool") {
      if (level == "Accord Method 1") {
        const student_exist = await AccordMethod1.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({_id:student_id}, { level: "Accord Method 1" });
          if(update_exist){
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Accord Method 2") {
        const student_exist = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({_id:student_id}, { level: "Accord Method 2" });
          if(update_exist){
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Piano for Singer") {
        const student_exist = await PianoSinger.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({_id:student_id}, { level: "Piano for Singer" });
          if(update_exist){
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({_id:student_id}, { level: "P&W Skool" });
          if(update_exist){
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          const update_exist = await HynmalSkool.updateOne({student:student_id}, { level2: level2 });
          if(update_exist){
            res.send({ status: 202, msg: "Change has been done successful" });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        } 
      }
    }//P&W Skool
    else if (student_level == "P&W Skool") {
      if (level == "Accord Method 1") {
        const student_exist = await AccordMethod1.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({_id:student_id}, { level: "Accord Method 1" });
          if(update_exist){
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Accord Method 2") {
        const student_exist = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({_id:student_id}, { level: "Accord Method 2" });
          if(update_exist){
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Piano for Singer") {
        const student_exist = await PianoSinger.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({_id:student_id}, { level: "Piano for Singer" });
          if(update_exist){
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({_id:student_id}, { level: "Hymnal Skool" });
          if(update_exist){
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      }else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          const update_exist = await PWSkool.updateOne({student:student_id}, { level2: level2 });
          if(update_exist){
            res.send({ status: 202, msg: "Change has been done successful" });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        } 
      }
    }

  } else {
    //netherlands
    const student_neths = await Student_neth.findOne({ _id: student_id });
    const student_level = student_neths.level;

    if (student_level == "Accord Method 1") {
      if (level == "Accord Method 2") {
        const student_AccordMethod1P18 = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_AccordMethod1P18) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_neth.updateOne({_id:student_id}, { level: "Accord Method 2" });
          if(update_ex){
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }

        }
      } else if (level == "Piano for Singer") {
        const student_piano_singer = await PianoSinger.isThisStudentExist(student_id);
        if (!student_piano_singer) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_neth.updateOne({_id:student_id}, { level: "Piano for Singer" });

          if(update_ex){
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Hymnal Skool") {
        const student_hynmal_skool = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_hynmal_skool) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_neth.updateOne({_id:student_id}, { level: "Hymnal Skool" });
          if(update_ex){
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "P&W Skool") {
        const student_pw_skool = await PWSkool.isThisStudentExist(student_id);
        if (!student_pw_skool) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_neth.updateOne({_id:student_id}, { level: "P&W Skool" });
          if(update_ex){
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      }
    } //Accord Method 2
    else if (student_level == "Accord Method 2") {
      if (level == "Accord Method 1") {
        const student_AccordMethod1 = await AccordMethod1.isThisStudentExist(student_id);
        if (!student_AccordMethod1) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_neth.updateOne({_id:student_id}, { level: "Accord Method 1" });
          if(updatesuc){
            const student = new AccordMethod1(accordMethod1);
              student.save(function (err, change) {
                res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({status: 404, msg: "Change not done!"})
          }
        }
      } else if (level == "Piano for Singer") {
        const student_exist = await PianoSinger.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_neth.updateOne({_id:student_id}, { level: "Piano for Singer" });
          if(updatesuc){
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({status: 404, msg: "Change not done!"})
          }
        }
      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_neth.updateOne({_id:student_id}, { level: "Hymnal Skool" });
          if(updatesuc){
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({status: 404, msg: "Change not done!"})
          }
        }
      } else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_neth.updateOne({_id:student_id}, { level: "P&W Skool" });
          if(updatesuc){
            const student = new PWSkool(AccordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({status: 404, msg: "Change not done!"})
          }
        }
      }
    }//Piano for singer
    else if (student_level == "Piano for Singer") {
      if (level == "Accord Method 1") {
        const student_exist = await AccordMethod1.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({_id:student_id}, { level: "Accord Method 1" });
          if(update_exist){
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Accord Method 2") {
        const student_exist = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({_id:student_id}, { level: "Accord Method 2" });
          if(update_exist){
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      }  else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({_id:student_id}, { level: "Hymnal Skool" });
          if(update_exist){
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({_id:student_id}, { level: "P&W Skool" });
          if(update_exist){
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      }
    }//Hymnal Skool
    else if (student_level == "Hymnal Skool") {
      if (level == "Accord Method 1") {
        const student_exist = await AccordMethod1.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({_id:student_id}, { level: "Accord Method 1" });
          if(update_exist){
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Accord Method 2") {
        const student_exist = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({_id:student_id}, { level: "Accord Method 2" });
          if(update_exist){
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Piano for Singer") {
        const student_exist = await PianoSinger.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({_id:student_id}, { level: "Piano for Singer" });
          if(update_exist){
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      }else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({_id:student_id}, { level: "P&W Skool" });
          if(update_exist){
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          const update_exist = await Student_neth.updateOne({_id:student_id}, { level2: level2 });
          if(update_exist){
            res.send({ status: 202, msg: "Change has been done successful" });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        } 
      }
    }//P&W Skool
    else if (student_level == "P&W Skool") {
      if (level == "Accord Method 1") {
        const student_exist = await AccordMethod1.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({_id:student_id}, { level: "Accord Method 1" });
          if(update_exist){
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Accord Method 2") {
        const student_exist = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({_id:student_id}, { level: "Accord Method 2" });
          if(update_exist){
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Piano for Singer") {
        const student_exist = await PianoSinger.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({_id:student_id}, { level: "Piano for Singer" });
          if(update_exist){
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({_id:student_id}, { level: "Hymnal Skool" });
          if(update_exist){
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      }else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          const update_exist = await PWSkool.updateOne({student:student_id}, { level2: level2 });
          if(update_exist){
            res.send({ status: 202, msg: "Change has been done successful" });
          }else{
            res.send({ status: 404, msg: "Change not done!" })
          }
        } 
      }
    }
  }

});

//get audio files
app.post("/get_audio_files", async(req, res) => {

  const {stud_level, stud_id} = req.body;



  if(stud_level == "Accord Method 1"){
    const result = fs.readdirSync(path.resolve(__dirname,"public/media/audios/akord_metodo_1/"))
    res.send({ status : "202", data: result });
  }else if(stud_level == "Accord Method 2"){
    const result = fs.readdirSync(path.resolve(__dirname,"public/media/audios/akord_metodo_2/"))
    res.send({ status : "202", data: result });
  }else if(stud_level == "Piano for Singers"){
    const result = fs.readdirSync(path.resolve(__dirname,"public/media/audios/zangers_methode_1/"))
    res.send({ status : "202", data: result });
  }else if(stud_level == "Hymnal Skool"){

    const student_lid = await HynmalSkool.findOne({student: stud_id});  
    const stud_level2 = student_lid.level2;


    if(stud_level2 == "Nivel 1"){
      const result = fs.readdirSync(path.resolve(__dirname,"public/media/audios/hmnal_school/nivel_1"))
      res.send({ status : "202", data: result, level2N:"Nivel 1"});
    }else if(stud_level2 == "Nivel 2"){
      const result = fs.readdirSync(path.resolve(__dirname,"public/media/audios/hmnal_school/nivel_2"))
      res.send({ status : "202", data: result, level2N:"Nivel 2" });
    }else if(stud_level2 == "Nivel 3"){
      const result = fs.readdirSync(path.resolve(__dirname,"public/media/audios/hmnal_school/nivel_3"))
      res.send({ status : "202", data: result, level2N:"Nivel 3" });
    }else if(stud_level2 == "Nivel 4"){
      const result = fs.readdirSync(path.resolve(__dirname,"public/media/audios/hmnal_school/nivel_4"))
      res.send({ status : "202", data: result, level2N:"Nivel 4" });
    }else if(stud_level2 == "Nivel 5"){
      const result = fs.readdirSync(path.resolve(__dirname,"public/media/audios/hmnal_school/nivel_5"))
      res.send({ status : "202", data: result, level2N:"Nivel 5" });
    }

  }else if(stud_level == "P&W Skool"){

    const student_lid = await PWSkool.findOne({student: stud_id});
    const stud_level2 = student_lid.level2;

    if(stud_level2 == "Nivel 1"){
      const result = fs.readdirSync(path.resolve(__dirname,"public/media/audios/p_w_school/nivel_1"))
      res.send({ status : "202", data: result });
    }else if(stud_level2 == "Nivel 2"){
      const result = fs.readdirSync(path.resolve(__dirname,"public/media/audios/p_w_school/nivel_2"))
      res.send({ status : "202", data: result });
    }else if(stud_level2 == "Nivel 3"){
      const result = fs.readdirSync(path.resolve(__dirname,"public/media/audios/p_w_school/nivel_3"))
      res.send({ status : "202", data: result });
    }else if(stud_level2 == "Nivel 4"){
      const result = fs.readdirSync(path.resolve(__dirname,"public/media/audios/p_w_school/nivel_4"))
      res.send({ status : "202", data: result });
    }else if(stud_level2 == "Nivel 5"){
      const result = fs.readdirSync(path.resolve(__dirname,"public/media/audios/p_w_school/nivel_5"))
      res.send({ status : "202", data: result });
    }
  }else{
    res.send({ status : "404", data: "Please contact the administrator." });
  }
});


// Routes
app.use(require("./routes"));
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

app.set("port", process.env.PORT || 4000);

server.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
