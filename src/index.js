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



// Routes
app.use(require("./routes"));
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

app.set("port", process.env.PORT || 4000);

server.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
