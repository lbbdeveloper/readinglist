import { Router } from "express";

const router = Router();
router.get("/", function (req, res) {
  res.render("index", {
    // user: req.user ? req.user : null,
    user: req.user,
  });
});

export { router };
