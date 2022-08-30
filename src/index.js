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
var nodemailer = require('nodemailer');
var hbs_mail = require('nodemailer-express-handlebars');


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
      res.json({ status: "ok", data: token, paid: stud_neth.paid, lang: "neth" });
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
      res.json({ status: "ok", data: token, paid: stud_pap.paid, lang: "pap" });
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

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ld.muziekschool@gmail.com",
          pass: "ld123456789",
        },
      });

      const handlebarOptions = {
        viewEngine: {
          extName: ".hbs",
          partialsDir: path.resolve('./views/pages'),
          defaultLayout: false,
        },
        viewPath: path.resolve('./views/pages'),
        extName: "_temp",
      }

      transporter.use('compile', hbs_mail(handlebarOptions));

      let mailOption = {
        from: "ld.muziekschool@gmail.com",
        to: `${email} ,carldave01@gmail.com`,
        subject: "Registration Confirmation",
        template: 'email',
        context: {
          username: username,
          password: plainTextPassword
        }
      };

      transporter.sendMail(mailOption, function (err, data) {
        if (err) {
          console.log("Error Occurs", err);
        } else {
          data.json({ status: "202", data: "Registration Successful" });
        }
      });
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

    let transporter = nodemailer.createTransport({
      service: "gmail",
      from: "imkk2021@yahoo.com",
      auth: {
        user: "ld.muziekschool@gmail.com",
        pass: "swqeaarjbnqhyzxr",
      },
     
    });

    //,carldave01@gmail.com 

    let mailOption = {
      from: "imkk2021@yahoo.com",
      to: `${email_pap}`,
      subject:"Instituto di Musika Kristian Korsou",
      html: `<html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>One Letter</title>
      
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
          <style>
              .ReadMsgBody {
                  width: 100%;
                  background-color: #ffffff;
              }
      
              .ExternalClass {
                  width: 100%;
                  background-color: #ffffff;
              }
      
              /* Windows Phone Viewport Fix */
              @-ms-viewport {
                  width: device-width;
              }
          </style>
      
      
      </head>
      
      <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"
          style="background: #e7e7e7; width: 100%; height: 100%; margin: 0; padding: 0;">
          <!-- Mail.ru Wrapper -->
          <div id="mailsub">
              <!-- Wrapper -->
              <center class="wrapper"
                  style="table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; padding: 0; margin: 0 auto; width: 100%; max-width: 960px;">
                  <!-- Old wrap -->
                  <div class="webkit">
                      <table cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
                          style="padding: 0; margin: 0 auto; width: 100%; max-width: 960px;">
                          <tbody>
                              <tr>
                                  <td align="center">
                                      <!-- Start Section (1 column) -->
                                      <table id="intro" cellpadding="0" cellspacing="0" border="0" bgcolor="#4F6331"
                                          align="center"
                                          style="width: 100%; padding: 0; margin: 0; background-image: url(https://user-images.githubusercontent.com/43387401/184557621-22faf6aa-1a93-4541-ac18-080bcbc16014.jpg?raw=true); background-size: auto 102%; background-position: center center; background-repeat: no-repeat; background-color: #080e02">
                                          <tbody>
                                              <tr>
                                                  <td colspan="3" height="20"></td>
                                              </tr>
                                              <tr>
                                                  <td width="330" style="width: 33%;"></td>
                                                  <!-- Logo -->
                                                  <td width="300" style="width: 30%;" align="center">
                                                      <a href="#" target="_blank" border="0"
                                                          style="border: none; display: block; outline: none; text-decoration: none; line-height: 60px; height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif;  -webkit-text-size-adjust:none;">
                                                          <img src="https://user-images.githubusercontent.com/43387401/187322248-f0536156-8916-4edc-a809-e73a36387ba0.png?raw=true" alt="One Letter" width="100" height="80"
                                                              border="0"
                                                              style="border: none; display: block; -ms-interpolation-mode: bicubic;">
                                                      </a>
                                                  </td>
                                                  <!-- Social Button -->
                                                  <td width="330" style="width: 33%;" align="right">
                                                      <div style="text-align: center; max-width: 150px; width: 100%;">
                                                          <span>&nbsp;</span>
                                                          <a href="#" target="_blank" border="0"
                                                              style="border: none; outline: none; text-decoration: none; line-height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif;  -webkit-text-size-adjust:none">
                                                              <img src="https://github.com/lime7/responsive-html-template/blob/master/index/f.png?raw=true"
                                                                  alt="facebook.com" border="0" width="11" height="23"
                                                                  style="border: none; outline: none; -ms-interpolation-mode: bicubic;">
                                                          </a>
                                                          <span>&nbsp;</span>
                                                          <a href="#" target="_blank" border="0"
                                                              style="border: none; outline: none; text-decoration: none; line-height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; -webkit-text-size-adjust:none">
                                                              <img src="https://github.com/lime7/responsive-html-template/blob/master/index/vk.png?raw=true"
                                                                  alt="vk.com" border="0" width="39" height="23"
                                                                  style="border: none; outline: none; -ms-interpolation-mode: bicubic;">
                                                          </a>
                                                          <span>&nbsp;</span>
                                                          <a href="#" target="_blank" border="0"
                                                              style="border: none; outline: none; text-decoration: none; line-height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; -webkit-text-size-adjust:none;">
                                                              <img src="https://github.com/lime7/responsive-html-template/blob/master/index/g+.png?raw=true"
                                                                  alt="google.com" border="0" width="23" height="23"
                                                                  style="border: none; outline: none; -ms-interpolation-mode: bicubic;">
                                                          </a>
                                                          <span>&nbsp;</span>
                                                      </div>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td colspan="3" height="100"></td>
                                              </tr>
                                              <!-- Main Title -->
                                              <tr>
                                                  <td colspan="3" height="60" align="center">
                                                      <div border="0"
                                                          style="border: none; line-height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; font-size: 52px; text-transform: uppercase; font-weight: bolder;">
                                                          Hi, ${name_pap}!</div>
                                                  </td>
                                              </tr>
                                              <!-- Line 1 -->
                                              <tr>
                                                  <td colspan="3" height="20" valign="bottom" align="center">
                                                      <img src="https://github.com/lime7/responsive-html-template/blob/master/index/line-1.png?raw=true"
                                                          alt="line" border="0" width="464" height="5"
                                                          style="border: none; outline: none; max-width: 464px; width: 100%; -ms-interpolation-mode: bicubic;">
                                                  </td>
                                              </tr>
                                              <!-- Meta title -->
                                              <tr>
                                                  <td colspan="3">
                                                      <table cellpadding="0" cellspacing="0" border="0" align="center"
                                                          style="padding: 0; margin: 0; width: 100%;">
                                                          <tbody>
                                                              <tr>
                                                                  <td width="90" style="width: 9%;"></td>
                                                                  <td align="center">
                                                                      <div border="0" style="border: none; height: 60px;">
                                                                          <p
                                                                              style="font-size: 18px; line-height: 24px; font-family: Verdana, Geneva, sans-serif; color: #ffffff; text-align: center; mso-table-lspace:0;mso-table-rspace:0;">
                                                                              Bon bini na Instituto di Musika Kristian Korsou, 
                                                                              awor bo ta parti di e gran tim di futuro pianistanan, 
                                                                              nos ta kontentu ku ba registra.
                                                                          </p>
                                                                      </div>
                                                                  </td>
                                                                  <td width="90" style="width: 9%;"></td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td colspan="3" height="160"></td>
                                              </tr>
                                              <tr>
                                                  <td width="330"></td>
                                                  <!-- Button Start -->
                                                  <td width="300" align="center" height="52">
                                                      <div
                                                          style="background-image: url(https://github.com/lime7/responsive-html-template/blob/master/index/intro__btn.png?raw=true); background-size: 100% 100%; background-position: center center; width: 225px;">
                                                          <a href="/login" target="_blank" width="160" height="52" border="0"
                                                              bgcolor="#009789"
                                                              style="border: none; outline: none; display: block; width:160px; height: 52px; text-transform: uppercase; text-decoration: none; font-size: 17px; line-height: 52px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; text-align: center; background-color: #009789;  -webkit-text-size-adjust:none;">
                                                              LogIn now
                                                          </a>
                                                      </div>
                                                  </td>
                                                  <td width="330"></td>
                                              </tr>
                                              <tr>
                                                  <td colspan="3" height="85"></td>
                                              </tr>
                                          </tbody>
                                      </table><!-- End Start Section -->
                                      <!-- Icon articles (4 columns) -->
                                      <div id="icon__article" class="device" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" align="center" style="width: 100%; padding: 0; margin: 0; background-color: #ffffff">
      
                                                  <h4 style="font-size: 18px; line-height: 24px; font-family: Verdana, Geneva, sans-serif; color: black; text-align: center; mso-table-lspace:0;mso-table-rspace:0;">Mi credentials</h4>
                                                  <div style="display: flex; font-family: Verdana, Geneva, sans-serif; color: black; justify-content:center; width:100%;">
                                                  <p style="padding-left: 25px;">Your username: ${username_pap}</p>
                                                  <p style="padding-left: 25px;">Your password: ${plainTextPassword}</p>
                                                  </div>
      
                                      </div> <!-- End Icon articles -->
                                      
                                      <div id="icon__article" class="device" cellpadding="0" cellspacing="0" border="0"
                                      bgcolor="#ffffff" align="center"
                                      style="width: 100%; padding: 0px; margin: 0; background-color: #009789">
  
                                      <h4
                                          style="font-size: 18px; line-height: 24px; font-family: Verdana, Geneva, sans-serif; color: white; text-align: center; mso-table-lspace:0;mso-table-rspace:0; padding-top:25px;">
                                          Pago</h4>
                                      <div
                                          style="display: flex; font-family: Verdana, Geneva, sans-serif; color: white; text-align: center; width:80%; display:flex; justify-content:center;">
                                          <p style="padding-left: 25px;"> Tur studiante mester paga e kontribushon mensual prome ku haña akseso pa su LD portal. Aki bou lo por haña e kontribushon segun edat. Hasi e pago online via MCB bank.<br>Account number:
                                          19371700</p>
                                      </div>
  
                                      <div
                                          style="display: flex; clear:both; box-sizing:border-box; justify-content:center; padding-top:25px; padding-bottom:15px; column-gap: 15px;">
                                          <div class="column" style="background-color:#b8ddda; color:rgb(0, 0, 0); float: left;width: 20%;padding: 10px;height: 200px;">
                                              <img src="https://user-images.githubusercontent.com/43387401/184559299-427bafaa-bd7e-4055-add6-0fd95f367b9e.png" style="padding-top: 15px; width: 77px;padding-right: 9px;">
                                              <h2 style="font-family: Verdana, Geneva, sans-serif; font-size:17px;">Mucha</h2>
                                              <p style="font-family: Verdana, Geneva, sans-serif; font-size:14px;">6 te ku 12 aña</p>
                                          </div>
                                          <div class="column"
                                              style="background-color:#b8ddda;float: left;width: 20%;padding: 10px;height: 200px; column-gap: 40px;">
                                               <img src="https://user-images.githubusercontent.com/43387401/184559304-f8694597-da87-4a6f-972a-cb4191bb2593.jpg" style="padding-top: 15px; width: 79px;">
                                              <h2 style="font-family: Verdana, Geneva, sans-serif; font-size:17px;">Tiner</h2>
                                              <p style="font-family: Verdana, Geneva, sans-serif; font-size:14px;">13 te ku 17 aña</p>
                                          </div>
                                          <div class="column"
                                              style="background-color:#b8ddda;float: left;width: 20%;padding: 10px;height: 200px;">
                                              <img src="https://user-images.githubusercontent.com/43387401/184559300-98c4d4e4-456b-4acd-adea-1cd53df5640b.png" style="padding-top: 15px; width: 52px;padding-left: 10px;">
                                              <h2 style="font-family: Verdana, Geneva, sans-serif; font-size:17px;">Hoben</h2>
                                              <p style="font-family: Verdana, Geneva, sans-serif; font-size:14px;">18 te ku 21 aña</p>
                                          </div>
                                          <div class="column"
                                              style="background-color:#b8ddda;float: left;width: 20%;padding: 10px;height: 200px;">
                                              <img src="https://user-images.githubusercontent.com/43387401/184559298-f423a962-5225-4d19-b06e-afe69b4b4a9a.png" style="padding-top: 30px; width: 85px;">
                                              <h2 style="font-family: Verdana, Geneva, sans-serif; font-size:17px;">Adulto</h2>
                                              <p style="font-family: Verdana, Geneva, sans-serif; font-size:14px;">21 bai ariba</p>
                                          </div>
                                      </div>
                                  </div>
                                      <!-- Footer -->
                                      <table id="news__article" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
                                          align="center"
                                          style="width: 100%; padding: 0; margin: 0; background-color: #ffffff">
                                          <tbody>
                                              <tr>
                                                  <td colspan="3" height="23"></td>
                                              </tr>
                                              <tr>
                                                  <td align="center">
                                                      <div border="0"
                                                          style="border: none; line-height: 14px; color: #727272; font-family: Verdana, Geneva, sans-serif; font-size: 16px;">
                                                          2022 © <a href="" target="_blank"
                                                              border="0"
                                                              style="border: none; outline: none; text-decoration: none; line-height: 14px; font-size: 16px; color: #727272; font-family: Verdana, Geneva, sans-serif; -webkit-text-size-adjust:none;">Instituto di Musika Kristian Korsou</a>
                                                      </div>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td colspan="3" height="23"></td>
                                              </tr>
                                          </tbody>
                                      </table> <!-- End Footer -->
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div> <!-- End Old wrap -->
              </center> <!-- End Wrapper -->
          </div> <!-- End Mail.ru Wrapper -->
      </body>
      
      </html>`
    };

    transporter.sendMail(mailOption, function (err, res) {
      if(err){
        res.send({error:"Send mail error contact administrator!"})
      }
    });

    //admin email send
    let transporter_admin = nodemailer.createTransport({
      service: "gmail",
      from: "imkk2021@yahoo.com",
      auth: {
        user: "ld.muziekschool@gmail.com",
        pass: "swqeaarjbnqhyzxr",
      },
     
    });


    let mailOption_admin = {
      to: 'imkk2021@yahoo.com',
      subject:"Instituto di Musika Kristian Korsou",
      html: `<html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>One Letter</title>
      
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
          <style>
              .ReadMsgBody {
                  width: 100%;
                  background-color: #ffffff;
              }
      
              .ExternalClass {
                  width: 100%;
                  background-color: #ffffff;
              }
      
              /* Windows Phone Viewport Fix */
              @-ms-viewport {
                  width: device-width;
              }
          </style>
      
      
      </head>
      
      <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"
          style="background: #e7e7e7; width: 100%; height: 100%; margin: 0; padding: 0;">
          <!-- Mail.ru Wrapper -->
          <div id="mailsub">
              <!-- Wrapper -->
              <center class="wrapper"
                  style="table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; padding: 0; margin: 0 auto; width: 100%; max-width: 960px;">
                  <!-- Old wrap -->
                  <div class="webkit">
                      <table cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
                          style="padding: 0; margin: 0 auto; width: 100%; max-width: 960px;">
                          <tbody>
                              <tr>
                                  <td align="center">
                                      <!-- Start Section (1 column) -->
                                      <table id="intro" cellpadding="0" cellspacing="0" border="0" bgcolor="#4F6331"
                                          align="center"
                                          style="width: 100%; padding: 0; margin: 0; background-image: url(https://user-images.githubusercontent.com/43387401/184557621-22faf6aa-1a93-4541-ac18-080bcbc16014.jpg?raw=true); background-size: auto 102%; background-position: center center; background-repeat: no-repeat; background-color: #080e02">
                                          <tbody>
                                              <tr>
                                                  <td colspan="3" height="20"></td>
                                              </tr>
                                              <tr>
                                                  <td width="330" style="width: 33%;"></td>
                                                  <!-- Logo -->
                                                  <td width="300" style="width: 30%;" align="center">
                                                      <a href="#" target="_blank" border="0"
                                                          style="border: none; display: block; outline: none; text-decoration: none; line-height: 60px; height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif;  -webkit-text-size-adjust:none;">
                                                          <img src="https://user-images.githubusercontent.com/43387401/187322248-f0536156-8916-4edc-a809-e73a36387ba0.png?raw=true"
                                                              width="130" height="80" border="0"
                                                              style="border: none; display: block; -ms-interpolation-mode: bicubic;">
                                                      </a>
                                                  </td>
                                                  <!-- Social Button -->
                                                  <td width="330" style="width: 33%;" align="right">
                                                      <div style="text-align: center; max-width: 150px; width: 100%;">
                                                          <span>&nbsp;</span>
                                                          <a href="#" target="_blank" border="0"
                                                              style="border: none; outline: none; text-decoration: none; line-height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif;  -webkit-text-size-adjust:none">
                                                              <img src="https://github.com/lime7/responsive-html-template/blob/master/index/f.png?raw=true"
                                                                  alt="facebook.com" border="0" width="11" height="23"
                                                                  style="border: none; outline: none; -ms-interpolation-mode: bicubic;">
                                                          </a>
                                                          <span>&nbsp;</span>
                                                          <a href="#" target="_blank" border="0"
                                                              style="border: none; outline: none; text-decoration: none; line-height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; -webkit-text-size-adjust:none">
                                                              <img src="https://github.com/lime7/responsive-html-template/blob/master/index/vk.png?raw=true"
                                                                  alt="vk.com" border="0" width="39" height="23"
                                                                  style="border: none; outline: none; -ms-interpolation-mode: bicubic;">
                                                          </a>
                                                          <span>&nbsp;</span>
                                                          <a href="#" target="_blank" border="0"
                                                              style="border: none; outline: none; text-decoration: none; line-height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; -webkit-text-size-adjust:none;">
                                                              <img src="https://github.com/lime7/responsive-html-template/blob/master/index/g+.png?raw=true"
                                                                  alt="google.com" border="0" width="23" height="23"
                                                                  style="border: none; outline: none; -ms-interpolation-mode: bicubic;">
                                                          </a>
                                                          <span>&nbsp;</span>
                                                      </div>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td colspan="3" height="100"></td>
                                              </tr>
                                              <!-- Main Title -->
                                              <tr>
                                                  <td colspan="3" height="60" align="center">
                                                      <div border="0"
                                                          style="border: none; line-height: 60px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; font-size: 52px; text-transform: uppercase; font-weight: bolder;">
                                                          Hi, Admin!</div>
                                                  </td>
                                              </tr>
                                              <!-- Line 1 -->
                                              <tr>
                                                  <td colspan="3" height="20" valign="bottom" align="center">
                                                      <img src="https://github.com/lime7/responsive-html-template/blob/master/index/line-1.png?raw=true"
                                                          alt="line" border="0" width="464" height="5"
                                                          style="border: none; outline: none; max-width: 464px; width: 100%; -ms-interpolation-mode: bicubic;">
                                                  </td>
                                              </tr>
                                              <!-- Meta title -->
                                              <tr>
                                                  <td colspan="3">
                                                      <table cellpadding="0" cellspacing="0" border="0" align="center"
                                                          style="padding: 0; margin: 0; width: 100%;">
                                                          <tbody>
                                                              <tr>
                                                                  <td width="90" style="width: 9%;"></td>
                                                                  <td align="center">
                                                                      <div border="0" style="border: none; height: 60px;">
                                                                          <p
                                                                              style="font-size: 18px; line-height: 24px; font-family: Verdana, Geneva, sans-serif; color: #ffffff; text-align: center; mso-table-lspace:0;mso-table-rspace:0;">
                                                                              Yes! Un studiante mas a kaba di wòrdu registra
                                                                              den nos sistema, ya bo sa ban laga nos studiante
                                                                              nobo sigui ku e siguiente stap nan.
                                                                          </p>
                                                                      </div>
                                                                  </td>
                                                                  <td width="90" style="width: 9%;"></td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td colspan="3" height="160"></td>
                                              </tr>
                                              <tr>
                                                  <td width="330"></td>
                                                  <!-- Button Start -->
                                                  <td width="300" align="center" height="52">
                                                      <div
                                                          style="background-image: url(https://github.com/lime7/responsive-html-template/blob/master/index/intro__btn.png?raw=true); background-size: 100% 100%; background-position: center center; width: 225px;">
                                                          <a href="/login" target="_blank" width="160" height="52" border="0"
                                                              bgcolor="#009789"
                                                              style="border: none; outline: none; display: block; width:160px; height: 52px; text-transform: uppercase; text-decoration: none; font-size: 17px; line-height: 52px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; text-align: center; background-color: #009789;  -webkit-text-size-adjust:none;">
                                                              LogIn now
                                                          </a>
                                                      </div>
                                                  </td>
                                                  <td width="330"></td>
                                              </tr>
                                              <tr>
                                                  <td colspan="3" height="85"></td>
                                              </tr>
                                          </tbody>
                                      </table><!-- End Start Section -->
                                      <!-- Icon articles (4 columns) -->
                                      <div id="icon__article" class="device" cellpadding="0" cellspacing="0" border="0"
                                          bgcolor="#ffffff" align="center"
                                          style="width: 100%; padding: 0; margin: 0; background-color: #ffffff">
      
                                          <h4 style="font-size: 18px; line-height: 24px; font-family: Verdana, Geneva, sans-serif; color: black; text-align: center; mso-table-lspace:0;mso-table-rspace:0;">
                                              Informashon di studiante</h4>
      
                                          <div style="display: flex; font-family: Verdana, Geneva, sans-serif; color: black; justify-content:center; flex-direction: column; width:80%; padding-bottom: 25px">
                                              E siguiente stap ta pa kontakta e studiante via Whatsapp na e numnber si telefòn ku el a proveé. Pa manda infoshon di pago, teminando ku esaki lo bo por pone e status di pago den 
                                              den nos portal pa duna e studiante akseso na su lèsnan.
                                          </div>
                                          <div
                                              style="display: flex; font-family: Verdana, Geneva, sans-serif; color: black; justify-content:center; flex-direction: column; width:100%;padding-bottom: 25px; padding-left: 20px;">
                                              <p style="padding-left: 25px;">Nòmber: ${username_pap}</p>
                                              <p style="padding-left: 25px;">Fam: ${lastname_pap}</p>
                                              <p style="padding-left: 25px;">Pastor: ${pastor}</p>
                                              <p style="padding-left: 25px;">Email: ${email_pap}</p>
                                              <p style="padding-left: 25px;">Number Telefòn: ${telefoon_pap}</p>
                                          </div>
      
                                      </div> <!-- End Icon articles -->
      
                                      <!-- Footer -->
                                      <table id="news__article" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"
                                          align="center"
                                          style="width: 100%; padding: 0; margin: 0; background-color: #009789">
                                          <tbody>
                                              <tr>
                                                  <td colspan="3" height="23"></td>
                                              </tr>
                                              <tr>
                                                  <td align="center">
                                                      <div border="0"
                                                          style="border: none; line-height: 14px; color: #ffffff; font-family: Verdana, Geneva, sans-serif; font-size: 16px; >
                                                          2022 © <a href="" target="_blank" border="0"
                                                              style="border: none; outline: none; text-decoration: none; line-height: 14px; font-size: 16px; color: #727272; font-family: Verdana, Geneva, sans-serif; -webkit-text-size-adjust:none;">Instituto
                                                              di Musika Kristian Korsou</a>
                                                      </div>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td colspan="3" height="23"></td>
                                              </tr>
                                          </tbody>
                                      </table> <!-- End Footer -->
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </div> <!-- End Old wrap -->
              </center> <!-- End Wrapper -->
          </div> <!-- End Mail.ru Wrapper -->
      </body>
      
      </html>`
    };

    transporter_admin.sendMail(mailOption_admin, function (err, res) {
      if(err){
        res.send({error:"Send mail error contact administrator!"})
      }
    });

    res.send({ status:"202", data:"Registrashon kompleta"});
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.send({ status: "402", error: "Studiante ta existi kaba" });
    }
    throw error;
  }
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
          const update_ex = await Student_pap.updateOne({ _id: student_id }, { level: "Accord Method 2" });
          if (update_ex) {
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }

        }
      } else if (level == "Piano for Singer") {
        const student_piano_singer = await PianoSinger.isThisStudentExist(student_id);
        if (!student_piano_singer) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_pap.updateOne({ _id: student_id }, { level: "Piano for Singer" });

          if (update_ex) {
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Hymnal Skool") {
        const student_hynmal_skool = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_hynmal_skool) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_pap.updateOne({ _id: student_id }, { level: "Hymnal Skool" });
          if (update_ex) {
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "P&W Skool") {
        const student_pw_skool = await PWSkool.isThisStudentExist(student_id);
        if (!student_pw_skool) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_pap.updateOne({ _id: student_id }, { level: "P&W Skool" });
          if (update_ex) {
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
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
          const updatesuc = await Student_pap.updateOne({ _id: student_id }, { level: "Accord Method 1" });
          if (updatesuc) {
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Piano for Singer") {
        const student_exist = await PianoSinger.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_pap.updateOne({ _id: student_id }, { level: "Piano for Singer" });
          if (updatesuc) {
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_pap.updateOne({ _id: student_id }, { level: "Hymnal Skool" });
          if (updatesuc) {
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_pap.updateOne({ _id: student_id }, { level: "P&W Skool" });
          if (updatesuc) {
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
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
          const update_exist = await Student_pap.updateOne({ _id: student_id }, { level: "Accord Method 1" });
          if (update_exist) {
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Accord Method 2") {
        const student_exist = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({ _id: student_id }, { level: "Accord Method 2" });
          if (update_exist) {
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({ _id: student_id }, { level: "Hymnal Skool" });
          if (update_exist) {
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({ _id: student_id }, { level: "P&W Skool" });
          if (update_exist) {
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
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
          const update_exist = await Student_pap.updateOne({ _id: student_id }, { level: "Accord Method 1" });
          if (update_exist) {
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Accord Method 2") {
        const student_exist = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({ _id: student_id }, { level: "Accord Method 2" });
          if (update_exist) {
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Piano for Singer") {
        const student_exist = await PianoSinger.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({ _id: student_id }, { level: "Piano for Singer" });
          if (update_exist) {
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({ _id: student_id }, { level: "P&W Skool" });
          if (update_exist) {
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          const update_exist = await HynmalSkool.updateOne({ student: student_id }, { level2: level2 });
          if (update_exist) {
            res.send({ status: 202, msg: "Change has been done successful" });
          } else {
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
          const update_exist = await Student_pap.updateOne({ _id: student_id }, { level: "Accord Method 1" });
          if (update_exist) {
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Accord Method 2") {
        const student_exist = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({ _id: student_id }, { level: "Accord Method 2" });
          if (update_exist) {
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Piano for Singer") {
        const student_exist = await PianoSinger.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({ _id: student_id }, { level: "Piano for Singer" });
          if (update_exist) {
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_pap.updateOne({ _id: student_id }, { level: "Hymnal Skool" });
          if (update_exist) {
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          const update_exist = await PWSkool.updateOne({ student: student_id }, { level2: level2 });
          if (update_exist) {
            res.send({ status: 202, msg: "Change has been done successful" });
          } else {
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
          const update_ex = await Student_neth.updateOne({ _id: student_id }, { level: "Accord Method 2" });
          if (update_ex) {
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }

        }
      } else if (level == "Piano for Singer") {
        const student_piano_singer = await PianoSinger.isThisStudentExist(student_id);
        if (!student_piano_singer) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_neth.updateOne({ _id: student_id }, { level: "Piano for Singer" });

          if (update_ex) {
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Hymnal Skool") {
        const student_hynmal_skool = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_hynmal_skool) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_neth.updateOne({ _id: student_id }, { level: "Hymnal Skool" });
          if (update_ex) {
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "P&W Skool") {
        const student_pw_skool = await PWSkool.isThisStudentExist(student_id);
        if (!student_pw_skool) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod1.deleteOne({ _id: student_id });
          const update_ex = await Student_neth.updateOne({ _id: student_id }, { level: "P&W Skool" });
          if (update_ex) {
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
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
          const updatesuc = await Student_neth.updateOne({ _id: student_id }, { level: "Accord Method 1" });
          if (updatesuc) {
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Piano for Singer") {
        const student_exist = await PianoSinger.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_neth.updateOne({ _id: student_id }, { level: "Piano for Singer" });
          if (updatesuc) {
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_neth.updateOne({ _id: student_id }, { level: "Hymnal Skool" });
          if (updatesuc) {
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          AccordMethod2.deleteOne({ _id: student_id });
          const updatesuc = await Student_neth.updateOne({ _id: student_id }, { level: "P&W Skool" });
          if (updatesuc) {
            const student = new PWSkool(AccordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
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
          const update_exist = await Student_neth.updateOne({ _id: student_id }, { level: "Accord Method 1" });
          if (update_exist) {
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Accord Method 2") {
        const student_exist = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({ _id: student_id }, { level: "Accord Method 2" });
          if (update_exist) {
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({ _id: student_id }, { level: "Hymnal Skool" });
          if (update_exist) {
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PianoSinger.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({ _id: student_id }, { level: "P&W Skool" });
          if (update_exist) {
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
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
          const update_exist = await Student_neth.updateOne({ _id: student_id }, { level: "Accord Method 1" });
          if (update_exist) {
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Accord Method 2") {
        const student_exist = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({ _id: student_id }, { level: "Accord Method 2" });
          if (update_exist) {
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Piano for Singer") {
        const student_exist = await PianoSinger.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({ _id: student_id }, { level: "Piano for Singer" });
          if (update_exist) {
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          HynmalSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({ _id: student_id }, { level: "P&W Skool" });
          if (update_exist) {
            const student = new PWSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          const update_exist = await Student_neth.updateOne({ _id: student_id }, { level2: level2 });
          if (update_exist) {
            res.send({ status: 202, msg: "Change has been done successful" });
          } else {
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
          const update_exist = await Student_neth.updateOne({ _id: student_id }, { level: "Accord Method 1" });
          if (update_exist) {
            const student = new AccordMethod1(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Accord Method 2") {
        const student_exist = await AccordMethod2.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({ _id: student_id }, { level: "Accord Method 2" });
          if (update_exist) {
            const student = new AccordMethod2(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "Piano for Singer") {
        const student_exist = await PianoSinger.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({ _id: student_id }, { level: "Piano for Singer" });
          if (update_exist) {
            const student = new PianoSinger(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }

      } else if (level == "Hymnal Skool") {
        const student_exist = await HynmalSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          return res.send({ status: 404, msg: "Student is already in this class" });
        } else {
          PWSkool.deleteOne({ _id: student_id });
          const update_exist = await Student_neth.updateOne({ _id: student_id }, { level: "Hymnal Skool" });
          if (update_exist) {
            const student = new HynmalSkool(accordMethod1);
            student.save(function (err, change) {
              res.send({ status: 202, msg: "Change has been done successful" })
            });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      } else if (level == "P&W Skool") {
        const student_exist = await PWSkool.isThisStudentExist(student_id);
        if (!student_exist) {
          const update_exist = await PWSkool.updateOne({ student: student_id }, { level2: level2 });
          if (update_exist) {
            res.send({ status: 202, msg: "Change has been done successful" });
          } else {
            res.send({ status: 404, msg: "Change not done!" })
          }
        }
      }
    }
  }

});

//get audio files
app.post("/get_audio_files", async (req, res) => {

  const { stud_level, stud_id } = req.body;



  if (stud_level == "Accord Method 1") {
    const result = fs.readdirSync(path.resolve(__dirname, "public/media/audios/akord_metodo_1/"))
    res.send({ status: "202", data: result });
  } else if (stud_level == "Accord Method 2") {
    const result = fs.readdirSync(path.resolve(__dirname, "public/media/audios/akord_metodo_2/"))
    res.send({ status: "202", data: result });
  } else if (stud_level == "Piano for Singers") {
    const result = fs.readdirSync(path.resolve(__dirname, "public/media/audios/zangers_methode_1/"))
    res.send({ status: "202", data: result });
  } else if (stud_level == "Hymnal Skool") {

    const student_lid = await HynmalSkool.findOne({ student: stud_id });
    const stud_level2 = student_lid.level2;


    if (stud_level2 == "Nivel 1") {
      const result = fs.readdirSync(path.resolve(__dirname, "public/media/audios/hmnal_school/nivel_1"))
      res.send({ status: "202", data: result, level2N: "Nivel 1" });
    } else if (stud_level2 == "Nivel 2") {
      const result = fs.readdirSync(path.resolve(__dirname, "public/media/audios/hmnal_school/nivel_2"))
      res.send({ status: "202", data: result, level2N: "Nivel 2" });
    } else if (stud_level2 == "Nivel 3") {
      const result = fs.readdirSync(path.resolve(__dirname, "public/media/audios/hmnal_school/nivel_3"))
      res.send({ status: "202", data: result, level2N: "Nivel 3" });
    } else if (stud_level2 == "Nivel 4") {
      const result = fs.readdirSync(path.resolve(__dirname, "public/media/audios/hmnal_school/nivel_4"))
      res.send({ status: "202", data: result, level2N: "Nivel 4" });
    } else if (stud_level2 == "Nivel 5") {
      const result = fs.readdirSync(path.resolve(__dirname, "public/media/audios/hmnal_school/nivel_5"))
      res.send({ status: "202", data: result, level2N: "Nivel 5" });
    }

  } else if (stud_level == "P&W Skool") {

    const student_lid = await PWSkool.findOne({ student: stud_id });
    const stud_level2 = student_lid.level2;

    if (stud_level2 == "Nivel 1") {
      const result = fs.readdirSync(path.resolve(__dirname, "public/media/audios/p_w_school/nivel_1"))
      res.send({ status: "202", data: result });
    } else if (stud_level2 == "Nivel 2") {
      const result = fs.readdirSync(path.resolve(__dirname, "public/media/audios/p_w_school/nivel_2"))
      res.send({ status: "202", data: result });
    } else if (stud_level2 == "Nivel 3") {
      const result = fs.readdirSync(path.resolve(__dirname, "public/media/audios/p_w_school/nivel_3"))
      res.send({ status: "202", data: result });
    } else if (stud_level2 == "Nivel 4") {
      const result = fs.readdirSync(path.resolve(__dirname, "public/media/audios/p_w_school/nivel_4"))
      res.send({ status: "202", data: result });
    } else if (stud_level2 == "Nivel 5") {
      const result = fs.readdirSync(path.resolve(__dirname, "public/media/audios/p_w_school/nivel_5"))
      res.send({ status: "202", data: result });
    }
  } else {
    res.send({ status: "404", data: "Please contact the administrator." });
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
