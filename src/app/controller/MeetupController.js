import * as Yup from "yup";
import Meetup from "../models/Meetup";

class MeetupController {
  //list
  async index(req, res) {
    const meetup = await Meetup.findAll();

    return res.json(meetup);
  }

  //todo metodo dos controller são em tese meddleare
  async store(req, res) {
    //criando o schema para validar dados com o Yup
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      user_id: Yup.string().required()
    });

    //validando a requisição
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: "Dados inválidos" });
    }
    const meetup = await Meetup.create(req.body);

    return res.json(meetup);
    /*
    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: "Esse email já esta cadastrado" });
    }

    const user = await User.create(req.body);

    return res.json(user);
    */
  }

  async update(req, res) {
    //criando o schema para validar dados com o Yup
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        //vamos aqui ver se ele quer trocar de senha,
        //o when te acesso a todos os dados da schema. field = password
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      //vamos pedir aqui que se o password for digitado, um confirmPassword
      //deve ser preenchido igualmente
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      )
    });

    //validando a requisição
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: "Dados inválidos" });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    //verificar se o email que foi enviado existe no banco, para
    //saber se é um user válido
    if (email != user.email) {
      const userExist = await User.findOne({ where: { email } });
      //verificando se o email que a pessoa mudou, já existe no sistema
      if (userExist) {
        return res.status(400).json({ error: "Esse email já esta cadastrado" });
      }
    }
    //verificar se o user quer mudar a senha e se a senha anterior é válda
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Password Invalido" });
    }

    //vamos agora efetivamente atualizar o user
    const userAtualizado = await user.update(req.body);

    return res.json(userAtualizado);
  }
}

export default new MeetupController();
