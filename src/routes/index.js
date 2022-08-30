const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/login", (req, res) => {
    res.render("auth/login", { layout: false });
  });
router.get("/language_reg", (req, res) => {
    res.render("pages/language_reg", { layout: false });
  });

  router.get("/register_pap", (req, res) => {
    res.render("auth/register_pap", { layout: false });
  });
  router.get("/register_neth", (req, res) => {
    res.render("auth/register_neth", { layout: false });
  });

//admin portal
  router.get("/portal_admin", (req, res) => {
    res.render("pages/admin/admin_home_p", { layout: false });
  });
  router.get("/admin_student_neth", (req, res) => {
    res.render("pages/admin/admin_student_neth", { layout: false });
  });
  router.get("/admin_student_cur", (req, res) => {
    res.render("pages/admin/admin_student_cur", { layout: false });
  });
  router.get("/admin_nl_edit", (req, res) => {
    res.render("pages/admin/admin_nl_edit", { layout: false });
  });
  router.get("/admin_cur_edit", (req, res) => {
    res.render("pages/admin/admin_cur_edit", { layout: false });
  });
  router.get("/admin_classes", (req, res) => {
    res.render("pages/admin/admin_classes", { layout: false });
  });
  
  //student portal
  router.get("/student_home_pap", (req, res) => {
    res.render("pages/student/student_home_pap", { layout: false });
  });
  router.get("/student_audip_pap", (req, res) => {
    res.render("pages/student/student_audio_pap", { layout: false });
  });
  router.get("/student_home_neth", (req, res) => {
    res.render("pages/student/student_home_neth", { layout: false });
  });
  router.get("/student_audio_neth", (req, res) => {
    res.render("pages/student/student_audio_neth", { layout: false });
  });

  //email temp
  router.get("/email_temp", (req, res) => {
    res.render("email", { layout: false });
  });


module.exports = router;