module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("subscription", {
      id: {
        type: Sequelize.INTEGER,
        allownull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false
      },
      meetup_id: {
        type: Sequelize.INTEGER,
        references: { model: "meetups", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allownull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allownull: false
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable("subscription");
  }
};
