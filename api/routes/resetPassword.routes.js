import express from "express";
import {
  requestResetLink,
  getResetForm,
  resetPassword,
} from "../controllers/resetPassword.controllers.js";
const router = express.Router();

router.post("/", requestResetLink);
router.get("/reset", getResetForm);
router.post("/:userId/:token", resetPassword);

export default router;
