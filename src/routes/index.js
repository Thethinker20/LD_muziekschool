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



module.exports = router;