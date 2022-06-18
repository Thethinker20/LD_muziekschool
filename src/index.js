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
const Student = require("./routes/models/students");

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
    const admin = await Admin.findOne({username}).lean();

    console.log(admin);
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
        res.json({ status: "404", error: "Incorrect Password" });
      }
    } else if (!user) {
      return res.json({ status: "error1", error: "Incorrect Username" });
    } else {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          {
            id: user._id,
            citation: user.citation,
            username: user.username,
            name: user.name,
            username: user.username,
            lastNameM: user.lastNameM,
            lastNameP: user.lastNameP,
            address: user.address,
            username: user.username,
            country: user.country,
            state: user.state,
            city: user.city,
            email: user.email,
            age: user.age,
            date: user.date,
            time: user.time,
            motivConsult: user.motivConsult,
            evaSalud: user.evaSalud,
            soluProb: user.soluProb,
            cita: user.cita,
            comentarios: user.comentarios,
            pagos: user.pagos,
          },
          JWT_SECRET
        );
        res.json({ status: "ok", data: token });
      } else if (!user) {
        return res.json({ status: "error1", error: "Usuario invalido" });
      } else {
        res.json({ status: "404", error: "Contraseña invalido" });
      }
    }
  });

//register
app.post("/registerForm", async (req, res) => {
  const {
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
    const response = await Student.create({
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
      return res.json({ status: "402", error: "Username already in use" });
    }
    throw error;
  }
  res.json({ status: "ok" });
});

// Routes
app.use(require("./routes"));
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

app.set("port", process.env.PORT || 4000);

server.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
