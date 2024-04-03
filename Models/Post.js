module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define(
    "post",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(250),
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(250),
        allowNull: true,
      },
      userId: {
        // Foreign key for user
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "id",
        },
      },
      doctorId: {
        // Foreign key for doctor
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Doctor",
          key: "id",
        },
      },
      pharmacistId: {
        // Foreign key for pharmacist
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Pharmacist",
          key: "id",
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    },
    {
      timestamps: false,
      tableName: "post",
    }
  );

  return Post;
};
