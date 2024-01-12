module.exports = (sequelize, Sequelize) => {
  const Doctor = sequelize.define(
    "doctor",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fullName: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      mobileNumber: {
        type: Sequelize.STRING(250),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(250),
        allowNull: false,
        unique: true,
      },
      doctor_id: {
        type: Sequelize.STRING(250),
        allowNull: false,
        defaultValue: false,
        unique: true,
      },
      doctor_certificate: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      doctor_photo: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      registrationDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      validation: {
        type: Sequelize.INTEGER,
        length: 4,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
      tableName: "doctor",
    }
  );
  return Doctor;
};
