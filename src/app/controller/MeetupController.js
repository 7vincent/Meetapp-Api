import * as Yup from "yup";
import { parseISO, isBefore } from "date-fns";
import Meetup from "../models/Meetup";

class MeetupController {
  //listagem das meetups do organizador
  async myMeetups(req, res) {
    const meetup = await Meetup.findAll({
      where: {
        user_id: req.userId
      }
    });

    return res.json(meetup);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      user_id: Yup.string().required()
    });

    //validando a requisição
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: "Todos os dados são obrigatórios, verifique se tem algum errado."
      });
    }

    //validando se meetup tem data posterior a hj
    const parsedDate = parseISO(req.body.date);
    //12 - 16
    if (isBefore(parsedDate, new Date())) {
      return res.status(401).json({ error: "Data já passou, inválida!" });
    }

    const meetup = await Meetup.create(req.body);

    return res.json(meetup);
  }

  async update(req, res) {
    //pode editar: quem ele é organizador e que não passou a data

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required()
    });

    //validando a requisição
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: "Todos os dados são obrigatórios, verifique se tem algum errado."
      });
    }

    //verificando se user é dono do meetup
    const meetup = await Meetup.findOne({
      where: {
        user_id: req.userId,
        id: req.body.id
      }
    });
    //return res.json(meetup);
    if (!meetup) {
      return res.status(400).json({
        error: "Meetap não encontrado ou você não é dono desse meetup!"
      });
    }

    //validando se meetup ja aconteceu ou não, se já, não pode editar
    const { date } = meetup; // 2019-10-17
    if (isBefore(date, new Date())) {
      return res
        .status(401)
        .json({ error: "Data já passou, este meetup não pode ser editado." });
    }

    //vamos agora efetivamente atualizar o meetup
    const meetupAtualizado = await meetup.update(req.body);

    return res.json(meetupAtualizado);
  }

  async delete(req, res) {
    //validar se o meetup é do user logado
    //verificando se user é dono do meetup
    const meetup = await Meetup.findOne({
      where: {
        user_id: req.userId,
        id: req.body.id
      }
    });

    if (!meetup) {
      return res.status(400).json({
        error: "Meetap não encontrado ou você não é dono desse meetup!"
      });
    }
    //validando se meetup ja aconteceu ou não
    const { date } = meetup; // 2019-10-17
    if (isBefore(date, new Date())) {
      return res
        .status(401)
        .json({ error: "Data já passou, este meetup não pode ser deletado." });
    }

    //vamos agora efetivamente deletar o meetup
    await meetup.destroy(req.body.id);

    return res.json("true");
  }
}

export default new MeetupController();
