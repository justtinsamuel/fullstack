const { Op } = require("sequelize");
const { User, Profile } = require("../models");
const { encryptPwd, decryptPwd } = require("../helpers/bcrypt");
const { tokenGenerator } = require("../helpers/jwt");

class UserController {
  static async getUsers(req, res) {
    try {
      let result = await User.findAll({
        include: [Profile],
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async getUserById(req, res) {
    try {
      const id = +req.params.id;
      let result = await User.findOne({
        where: { id },
        include: [Profile],
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  static async add(req, res) {
    try {
      const { email, password, username, image } = req.body;
      let encrypted = encryptPwd(password);

      let profile = await Profile.create();
      let result = await User.create({
        email,
        password: encrypted,
        username,
        image,
        ProfileId: profile.id,
      });

      res.status(201).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  static async delete(req, res) {
    try {
      const id = +req.params.id;
      let result = await User.destroy({
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
      const { email, password, username, image } = req.body;
      let result = await User.update(
        {
          email,
          password,
          username,
          image,
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
      let result = await User.findAll({
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

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      let userFound = await User.findOne({
        where: { email },
      });
      if (userFound) {
        if (decryptPwd(password, userFound.password)) {
          const access_token = tokenGenerator(userFound);
          res.json({ access_token });
        } else {
          res.json({
            message: "Invalid password",
          });
        }
      } else {
        res.json({
          message: "Email not found",
        });
      }
    } catch (err) {
      res.json(err);
    }
  }
}

module.exports = UserController;
