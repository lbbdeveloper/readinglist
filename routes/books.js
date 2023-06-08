import { Router } from "express";
import * as bookCtrl from "../controllers/book.js";

const router = Router();

router.get("/", bookCtrl.index);
router.get("/new", bookCtrl.new);

export { router };
