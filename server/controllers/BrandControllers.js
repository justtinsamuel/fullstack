const { Op } = require("sequelize");
const { Brand } = require("../models");

class BrandController {
  static async getBrands(req, res) {
    try {
      let result = await Brand.findAll();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async getBrandById(req, res) {
    try {
      const id = +req.params.id;
      let result = await Brand.findOne({
        where: { id },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async add(req, res) {
    try {
      const { name, city, region, country } = req.body;
      let result = await Brand.create({
        name,
        city,
        region,
        country,
      });
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async delete(req, res) {
    try {
      const id = +req.params.id;
      let result = await Brand.destroy({
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
      const { name, city, region, country } = req.body;
      let result = await Brand.update(
        {
          name,
          city,
          region,
          country,
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
      let result = await Brand.findAll({
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

module.exports = BrandController;