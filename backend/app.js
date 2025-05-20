  const experss = require("express");
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const plansRoutes = require("./routes/plansRoutes");
const actplanRoutes = require("./routes/actplanRoutes");
const supportRoutes = require("./routes/supportRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const refferalRoutes = require("./routes/refferalRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const settingsRoutes = require("./routes/settingsRoutes")
const depositeRoutes = require("./routes/depositeRoutes");
const topupRoutes = require("./routes/topupRoutes");
const qrRoutes = require("./routes/qrRoutes");
const transferRoutes = require("./routes/transferRoutes");
const newsRoutes = require("./routes/newsRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const otpRoutes = require("./routes/otpRoutes");
const achiversRoutes = require("./routes/achiversRoutes");
const forgotRoutes = require("./routes/forgotRoutes");
const ctoRoutes = require("./routes/ctoRoutes");
const salrayRoutes = require("./routes/salrayRoutes");
const offerRoutes = require("./routes/offers");
const codesRoutes = require("./routes/codes");
const bonusRoutes = require("./routes/bouns");
const ticketRoutes = require("./routes/ticketRoutes");
const nowpaymentRoutes = require("./routes/nowpayments");

const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config({ path: "backend/config/config.env" });
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/errorMiddleware");
const fileUpload = require('express-fileupload');
const app = experss();
app.use(experss.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(cookieParser());
app.use(cors({
  origin: "*",  // Specify allowed domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all necessary methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
}));

// Handle preflight requests
app.options('*', cors());
app.use(fileUpload());


app.get('/home',(req, res)=>{
  res.send("hii")
})


app.use("/api/v1/bonus", bonusRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/plans", plansRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/actplan", actplanRoutes);
app.use("/api/v1/support", supportRoutes);
app.use("/api/v1/withdrawalrequest", withdrawalRoutes);
app.use("/api/v1/referral", refferalRoutes);
app.use("/api/v1/deposite", depositeRoutes);
app.use("/api/v1/topup", topupRoutes);
app.use("/api/v1/rewards", rewardRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/qr", qrRoutes);
app.use("/api/v1/tr", transactionRoutes);
app.use("/api/v1/transfer", transferRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/otp", otpRoutes);
app.use("/api/v1/achivers", achiversRoutes);
app.use("/api/v1/pass", forgotRoutes);
app.use("/api/v1/salary", salrayRoutes);
app.use("/api/v1/cto", ctoRoutes);
app.use("/api/v1/offers", offerRoutes);
app.use("/api/v1/codes", codesRoutes);
app.use("/api/v1/now-payments", nowpaymentRoutes);

app.use(errorMiddleware);
module.exports = app;

