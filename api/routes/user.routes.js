import {
  register,
  login,
  logout,
  saveJob,
  getSavedJobs,
  getToken,
  braintreeTokenController,
  brainTreePaymentController,
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/authJwt.js";
import verifySignUp from "../middlewares/verifySignup.js";

import express from "express";
const router = express.Router();

router.post("/signup", [verifySignUp], register);

router.post("/signin", login);

router.get("/logout", logout);

router.post("/saveJob", saveJob);

router.post("/getSavedJobs", getSavedJobs);
router.post("/getToken", getToken);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", verifyToken, brainTreePaymentController);
export default router;
