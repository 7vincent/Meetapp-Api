import Sequelize, { Model } from "sequelize";

class File extends Model {
  // metodo chamado automaticamente pelo sequelize
  static init(sequelize) {
    // vou enviar via super apenas colunas que vou preencher, não id
    //não precisa ser uma repica do banco
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING
      },
      {
        sequelize
      }
    );

    //retornar o model que acabou de ser inicializado
    return this;
  }
}

export default File;
