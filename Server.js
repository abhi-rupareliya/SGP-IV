require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const logger = require("morgan");
const db = require("./Database/config");
const Routes = require("./Routers");

db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");
});

const app = express();
app.use(logger("dev"));
app.use(
  cors({
    origin: `http://${process.env.HOST}:${process.env.PORT}`,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
});

app.use("/user", Routes.user);
app.use("/doctor", Routes.doctor);
app.use("/pharmacist", Routes.pharmacist);
app.use("/auth", Routes.auth);
app.use("/pharmacy", Routes.pharmacy);
app.use("/post", Routes.post);

app.listen(process.env.PORT, () => {
  console.log("Server started...");
  console.log(`visit http://${process.env.HOST}:${process.env.PORT}`);
});
