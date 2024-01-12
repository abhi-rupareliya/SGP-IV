const { Sequelize } = require("sequelize");
const Models = require("../Models");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
    pool: { max: 5, min: 0 },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db = {
  Sequelize,
  sequelize,
};
db.User = Models.User(sequelize, Sequelize);
db.Doctor = Models.Doctor(sequelize, Sequelize);
db.Pharmacist = Models.Pharmacist(sequelize, Sequelize);

db.findUserByEmail = async (email) => {
  const users = await Promise.all([
    db.User.findOne({ where: { email } }),
    db.Doctor.findOne({ where: { email } }),
    db.Pharmacist.findOne({ where: { email } }),
  ]);
  const roles = ["user", "doctor", "pharmacist"];
  let user = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i]) {
      user = users[i];
      // add role property to user object
      // for uses like checking role in auth middleware
      user.role = roles[i];
      break;
    }
  }
  return user;
};

module.exports = db;