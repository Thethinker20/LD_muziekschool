const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/login", (req, res) => {
    res.render("auth/login", { layout: false });
  });

// router.get("/succesful", (req, res) => {
//     res.render("pages/succesful", { layout: false });
//   });

module.exports = router;