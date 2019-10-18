import Sequelize, { Model } from "sequelize";

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        date: Sequelize.STRING
      },
      {
        sequelize,
        tableName: "meetups"
      }
    );

    //retornar o model que acabou de ser inicializado
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "owner" });
    this.belongsTo(models.File, { foreignKey: "banner_file_id" });
    this.belongsToMany(models.User, {
      foreignKey: "meetup_id",
      through: "subscription",
      as: "users"
    });
  }
}

export default Meetup;
