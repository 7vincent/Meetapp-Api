import Sequelize from "sequelize";

import databaseConfig from "../config/database";

//importar aqui todos os models
import User from "../app/models/User";
import File from "../app/models/File";
import Meetup from "../app/models/Meetup";

//vamos fazer um array com todos os models
const models = [User, File, Meetup];

class Database {
  constructor() {
    this.init();
  }
  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
