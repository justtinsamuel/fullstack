const { Op } = require("sequelize");
const { Type } = require("../models");

class TypeController {
  static async getTypes(req, res) {
    try {
      let result = await Type.findAll();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async getTypeById(req, res) {
    try {
      const id = +req.params.id;
      let result = await Type.findOne({
        where: { id },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async add(req, res) {
    try {
      const { name } = req.body;
      let result = await Type.create({
        name,
      });
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async delete(req, res) {
    try {
      const id = +req.params.id;
      let result = await Type.destroy({
        where: { id },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async edit(req, res) {
    try {
      const id = +req.params.id;
      const { name } = req.body;
      let result = await Type.update(
        {
          name1,
        },
        {
          where: { id },
        }
      );
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async search(req, res) {
    try {
      const searchQuery = req.query.name;
      let result = await Type.findAll({
        where: {
          name: {
            [Op.iLike]: `%${searchQuery}%`,
          },
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = TypeController;
