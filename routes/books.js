import { Router } from "express";
import * as bookCtrl from "../controllers/book.js";

const router = Router();

router.get("/", bookCtrl.index);
router.get("/new", bookCtrl.new);
router.post("/", bookCtrl.create);
router.get("/:id", bookCtrl.show);
router.get("/api/:id", bookCtrl.apibookshow);
router.get("/:id/addtolist", isLoggedIn, bookCtrl.addToList);
router.get("/:id/removefromlist", isLoggedIn, bookCtrl.removefromlist);
router.delete("/:id", bookCtrl.delete);
router.get("/:id/edit", bookCtrl.edit);
router.put("/:id", bookCtrl.update);
router.post("/search", bookCtrl.search);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/auth/google");
  }
}

export { router };
