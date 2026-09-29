import { Router } from "express";
import { shortController } from "../controller/shortController.js";
import {GetUserData} from "../controller/userData.js"
import { Forward } from "../controller/forward.js";
import { verify } from "../middleware/verify.js";
const router=Router()

router.post("/shortner",verify,shortController);
router.get("/getData",verify,GetUserData);
router.get("/:alias",verify,Forward)

export default router;