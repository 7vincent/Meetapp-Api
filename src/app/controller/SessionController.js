import jwt from "jsonwebtoken";
import User from "../models/User";
import * as Yup from "yup";
import authConfig from "../../config/auth";

class SessionController {
  async store(req, res) {
    //criando o schema para validar dados com o Yup
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string().required()
    });

    //validando a requisição
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: "Dados inválidos" });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    //vamos ver se o email nao existe no banco
    if (!user) {
      return res.status(401).json({ error: "Email não encontrado!" });
    }
    //vamos ver se a senha nao existe no banco
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Senha não confere." });
    }

    //se chegou até aqui, é pq os dados então certo
    const { id, name } = user;

    //vamos retornar os dados para o user
    //o token é composto no metodo sign(payload(informações do user que quero reutilizar),
    //  uma string unica (posso ir no site md5online e garar uma com nome da minha app talves),
    // e uma data de expiração do token)
    return res.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

export default new SessionController();
