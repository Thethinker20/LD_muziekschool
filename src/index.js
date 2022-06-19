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

//portal
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
  } else if (username.substring(username.length-3) == "326") {
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
        },
        JWT_SECRET
      );
      res.json({ status: "ok", data: token, lang:"neth" });
    } else {
      res.json({ status: "404", error: "Incorrect wachtwoord" });
    }
  } else if (username.substring(username.length-3) == "495") {
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
        },
        JWT_SECRET
      );
      res.json({ status: "ok", data: token , lang:"pap"});
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
      return res.json({ status: "402", error: "Gebruikersnaam al in gebruik" });
    }
    throw error;
  }
  res.json({ status: "ok" });
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
  res.json({ status: "ok" });
});

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


// Routes
app.use(require("./routes"));
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

app.set("port", process.env.PORT || 4000);

server.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
