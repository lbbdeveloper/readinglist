import { Router } from "express";

const router = Router();
router.get("/", function (req, res) {
  res.render("index", {
    user: req.user,
  });
});

export { router };
