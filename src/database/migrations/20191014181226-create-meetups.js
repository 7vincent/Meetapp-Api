module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("meetups", {
      id: {
        type: Sequelize.INTEGER,
        allownull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allownull: false
      },
      description: {
        type: Sequelize.STRING,
        allownull: false
      },
      location: {
        type: Sequelize.STRING,
        allownull: false
      },
      date: {
        type: Sequelize.DATE,
        allownull: false
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
    return queryInterface.dropTable("meetups");
  }
};
