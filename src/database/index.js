import Sequelize from "sequelize";

import databaseConfig from "../config/database";

//importar aqui todos os models
import User from "../app/models/User";

//vamos fazer um array com todos os models
const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
