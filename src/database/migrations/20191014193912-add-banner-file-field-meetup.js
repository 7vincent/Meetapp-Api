module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("meetups", "banner_file_id", {
      type: Sequelize.INTEGER,
      references: { model: "files", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true
    });
  },

  down: queryInterface => {
    return queryInterface.remodeColumn("meetups", "banner_file_id");
  }
};
