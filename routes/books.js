import { Router } from "express";
import * as bookCtrl from "../controllers/book.js";

const router = Router();

router.get("/", bookCtrl.index);
router.get("/new", bookCtrl.new);
router.post("/", bookCtrl.create);
router.get("/:id", bookCtrl.show);

export { router };
