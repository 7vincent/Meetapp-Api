import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
  // metodo chamado automaticamente pelo sequelize
  static init(sequelize) {
    // vou enviar via super apenas colunas que vou preencher, não id
    //não precisa ser uma repica do banco
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING
      },
      {
        sequelize
      }
    );

    /*
    1 - hooks são trechos de código que são executados
    a partir de acoes no model.
    2 - posso passar como parametro pra ele algumas das funções que
    fazem parte de sua lista, uma delas é essa que pode modificar
    qualquer coisa do user entes de salvar/editar no banco.
    */
    this.addHook("beforeSave", async user => {
      //agora vamos ser o password vai esta preenchido, se tiver
      //é pq houver uma mudança de senha ou é novo user
      if (user.password) {
        //o numero no fim dia respeito a força da criptografia
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    //retornar o model que acabou de ser inicializado
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
