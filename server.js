import express from "express";
import { config } from "dotenv";
// import mainService from "./services/mainService.js";
import userRoutes from "./api/routes/user.routes.js";
import jobRoutes from "./api/routes/job.routes.js";
import resetRoutes from "./api/routes/resetPassword.routes.js";
import connect from "./api/config/db.js";
import cors from "cors";
import { engine } from "express-handlebars";
import stripe from "stripe";

const app = express();
const stripee = stripe("sk_test_51NHFtEH40MT5zcXSLr0O782Nc4n2R2dJTJ0hgvnq5EQH2D3mEC3BxVrcrU5oULuUz3Res3tZspwzi0QEIz1VC1Cm00SYf8hdR1")
app.engine(
  "handlebars",
  engine({
    defaultLayout: false,
  })
);
app.set("view engine", "handlebars");
app.set("views", "./views");

//env config
config();

//app config
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//port config
const port = process.env.PORT || 9002;

//db config for APIs
await connect();
//services config
// await mainService();

//routes config
//home
app.get("/", (req, res) => {
  res.status(200).send({ message: "welcome to home" });
});
//user routes
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
app.use("/api/v1/users", userRoutes);
//job routes
app.use("/api/v1/jobs", jobRoutes);
//reset password routes
app.use("/api/v1/reset-password", resetRoutes);

//Stripe

app.post('/charge', async (req, res) => {
  try {
    const { token } = req.body;
    // Create a charge or perform any other necessary actions with the token
    const charge = await stripee.charges.create({
      amount: 1000, // Amount in cents
      currency: 'usd',
      source: token,
      description: 'Example charge',
    });

    // Handle the success case
    res.send('Payment successful');
  } catch (error) {
    // Handle the error case
    console.log(error);
    res.status(500).send('Payment failed');
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
