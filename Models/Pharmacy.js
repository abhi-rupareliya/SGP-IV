module.exports = (sequelize, Sequelize) => {
  const Pharmacy = sequelize.define(
    "pharmacy",
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
      address: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      pharmacy_no: {
        type: Sequelize.STRING(250),
        allowNull: false,
        defaultValue: false,
        unique: true,
      },
      pharmacy_certificate: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      pharmacy_photo: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      registrationDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      pharmacist_id: {
        type: Sequelize.INTEGER,
      },
      validation: {
        type: Sequelize.INTEGER,
        length: 4,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
      tableName: "pharmacy",
    }
  );
  return Pharmacy;
};
