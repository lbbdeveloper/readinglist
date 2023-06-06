import { Router } from "express";

const router = new Router();
router.get("/", function (req, res) {
  res.render("index", {
    user: req.user ? req.user : null,
  });
});

export { router };
