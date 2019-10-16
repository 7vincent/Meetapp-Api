import File from "../models/File";

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path
    });
    return res.json(file);
  }
  /*
  Apenas para vizualização no dev
  */
  async index(req, res) {
    const files = await File.findAll();

    return res.json(files);
  }
}

export default new FileController();
