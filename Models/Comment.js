module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define(
    "Comment",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Post",
          key: "id",
        },
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
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Doctor",
          key: "id",
        },
      },
      pharmacistId: {
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
      tableName: "comment",
    }
  );
  return Comment;
};
