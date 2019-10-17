import { isBefore } from "date-fns";

import Meetup from "../models/Meetup";
import User from "../models/User";

class SubscriptionController {
  async store(req, res) {
    //so pode em meetup que não organiza
    const { meetup_id } = req.body;
    const meetup = await Meetup.findOne({
      where: {
        user_id: req.userId,
        id: meetup_id
      }
    });
    //verificando se a inscricao é no meetup que ele é dono.
    if (meetup) {
      return res.status(400).json({
        error: "Você não pode se inscrever neste meetup."
      });
    }

    //validando se meetup ja aconteceu ou não
    const { date } = await Meetup.findOne({ where: { id: meetup_id } });
    if (isBefore(date, new Date())) {
      return res
        .status(401)
        .json({ error: "Data já passou, você não pode se inscrever." });
    }

    //add na tabela subscription um id do user com id do meetup
    const user = await User.findByPk(req.userId);
    const meetup_user = await Meetup.findByPk(meetup_id);

    //verificando se o user esta incrito neste meetup
    const subscription = await user.hasMeetup(meetup_user);
    if (subscription) {
      return res
        .status(401)
        .json({ error: "Você já se inscrevel neste meetup." });
    }
    //const subscription = await user.addMeetup(meetup_user);

    return res.json({ subscription });
  }
}

export default new SubscriptionController();
