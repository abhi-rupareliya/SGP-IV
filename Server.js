require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./Database/config");
const Routes = require("./Routers");

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

const app = express();
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

app.listen(process.env.PORT, () => {
  console.log("Server started...");
  console.log(`visit http://${process.env.HOST}:${process.env.PORT}`);
});
