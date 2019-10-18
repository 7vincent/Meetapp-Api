import { isBefore, isSameHour } from "date-fns";

import Meetup from "../models/Meetup";
import User from "../models/User";

import Mail from "../../lib/mail";

class SubscriptionController {
  async index(req, res) {
    //tudo abaixo no index foi teste
    const user = await User.findByPk(req.userId);

    //const subscription = await userLogado.getMeetups(User);
    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: "Nova Inscrição no seu Meetup!",
      text: "Novo Inscrito."
    });
    return res.json(user);
  }

  async store(req, res) {
    const meetupExist = await Meetup.findByPk(req.body.meetup_id);
    //1 - verificando se  meetup existe.
    if (!meetupExist) {
      return res.status(400).json({
        error: "Meetup não existe."
      });
    }

    const { meetup_id } = req.body;
    const meetup = await Meetup.findOne({
      where: {
        user_id: req.userId,
        id: meetup_id
      }
    });
    //2 - verificando se a inscricao é no meetup que ele é dono.
    if (meetup) {
      return res.status(400).json({
        error: "Você não pode se inscrever neste meetup."
      });
    }

    //3 - validando se meetup ja aconteceu ou não
    const { date } = await Meetup.findOne({ where: { id: meetup_id } });
    if (isBefore(date, new Date())) {
      return res
        .status(401)
        .json({ error: "Data já passou, você não pode se inscrever." });
    }

    //4 - verificando se o user esta incrito neste meetup
    const user = await User.findByPk(req.userId);
    const meetup_user = await Meetup.findByPk(meetup_id, {
      include: [
        {
          model: User,
          as: "owner",
          attribute: "name"
        }
      ]
    });

    const subscription = await user.hasMeetup(meetup_user);
    if (subscription) {
      return res
        .status(401)
        .json({ error: "Você já se inscreveu neste meetup." });
    }

    //4 - verificar se user já esta inscrito em outros meetups no mesmo horário
    //4.1 - Trazendo todos os meetups do user se inscreveu
    const { meetups: meetups } = await User.findByPk(req.userId, {
      include: {
        association: "meetups"
      }
    });
    //4.2 - verificando horarios se são iguais, não considero os min aqui
    const hourEqualMeetup = meetups.some(meetup => {
      return isSameHour(meetup_user.date, meetup.date);
    });

    if (hourEqualMeetup) {
      return res
        .status(401)
        .json({ error: "Você já se inscreveu em meetup neste horario" });
    }

    //5 - Se chegar até aqui, fazer inscrição no meetup
    const inscricao = await user.addMeetup(meetup_user);

    //enviando email para dono do meetup
    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: "Nova Inscrição no seu Meetup!",
      text: "Novo Inscrito: " + meetup_user.owner.name
    });

    return res.json(inscricao);
  }
}

export default new SubscriptionController();
