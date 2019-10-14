import jwt from "jsonwebtoken";
import { promisify } from "util";

import authConfig from "../../config/auth";

export default async (req, res, next) => {
  //authorization deve ser criado na headar da req
  const authHeader = req.headers.authorization;

  //se ele não existe, nem deve passar daq
  if (!authHeader) {
    return res.status(401).json({ error: "Falta token" });
  }

  //pegando o token do header
  const [, token] = authHeader.split(" ");

  try {
    //vamos decodificar o payload, usando o token do usar com
    // a authConfig.secret..
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    //dando certo, o decoded vai esta com os dados que foram incluidos
    //no payload
    req.userId = decoded.id;
  } catch (err) {
    return res.status(401).json({ error: "token invalido ou expirado" });
  }

  return next();
};
