import { Router } from "express";
import * as profileCtrl from "../controllers/profile.js";

const router = Router();

router.get("/:id", isLoggedIn, profileCtrl.show);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/auth/google");
  }
}
export { router };
