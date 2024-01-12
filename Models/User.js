module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
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
      medical_student: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      medical_student_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
      },
      user_photo: {
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
      tableName: "user",
    }
  );
  return User;
};
