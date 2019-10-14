import Sequelize, { Model } from "sequelize";

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        date: Sequelize.STRING
      },
      {
        sequelize
      }
    );

    //retornar o model que acabou de ser inicializado
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id" });
    this.belongsTo(models.File, { foreignKey: "banner_file_id" });
  }
}

export default Meetup;
