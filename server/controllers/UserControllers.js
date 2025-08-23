/**
 * controllers/userController.js
 *
 * Menangani register, login, dan beberapa operasi user dasar.
 * Semua method menampilkan response JSON dengan format konsisten:
 * { success: boolean, message: string, data?: any, error?: string }
 *
 * Catatan:
 * - Relasi User.hasOne(Profile), Profile.belongsTo(User) dengan foreignKey: "userId"
 * - Field password selalu di-hash sebelum disimpan.
 */

const { Op } = require("sequelize");
const { User, Profile } = require("../models");
const { encryptPwd, comparePwd } = require("../helpers/bcrypt");
const { tokenGenerator } = require("../helpers/jwt");

class UserController {
  static async getUsers(req, res) {
    try {
      const users = await User.findAll({ include: [Profile] });
      return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
      });
    } catch (err) {
      console.error("[UserController.getUsers] error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  }

  static async getUserById(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid user ID" });
      }

      const user = await User.findOne({ where: { id }, include: [Profile] });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    } catch (err) {
      console.error("[UserController.getUserById] error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  }

  /**
   * Register single user
   */
  static async add(req, res) {
    try {
      const { email, password, username, image } = req.body;

      if (!email || !password || !username) {
        return res.status(400).json({
          success: false,
          message: "email, username and password are required",
        });
      }

      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "Email already registered" });
      }

      const hashedPassword = await encryptPwd(password);

      // Buat user dulu
      const newUser = await User.create({
        email,
        password: hashedPassword,
        username,
        image,
      });

      // Buat profile default yang link ke user
      await Profile.create({ UserId: newUser.id });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          image: newUser.image,
        },
      });
    } catch (err) {
      console.error("[UserController.add] error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  }

  /**
   * Register multiple users
   */
  static async addBulk(req, res) {
    const t = await User.sequelize.transaction();
    try {
      const users = req.body;
      if (!Array.isArray(users) || users.length === 0) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Request body must be a non-empty array",
          });
      }

      for (const u of users) {
        if (!u.email || !u.password || !u.username) {
          return res.status(400).json({
            success: false,
            message: "Each user must have email, username and password",
          });
        }
      }

      const emails = users.map((u) => u.email);
      const existing = await User.findAll({ where: { email: emails } });
      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: `Some emails already registered: ${existing
            .map((e) => e.email)
            .join(", ")}`,
        });
      }

      // Hash password dulu
      const preparedUsers = [];
      for (const u of users) {
        const hashedPassword = await encryptPwd(u.password);
        preparedUsers.push({
          email: u.email,
          password: hashedPassword,
          username: u.username,
          image: u.image || null,
        });
      }

      // Bulk insert Users
      const newUsers = await User.bulkCreate(preparedUsers, {
        returning: true,
        transaction: t,
      });

      // Buat profiles masing-masing user
      const profiles = newUsers.map((user) => ({ UserId: user.id }));
      await Profile.bulkCreate(profiles, { transaction: t });

      await t.commit();

      const safeUsers = newUsers.map((u) => ({
        id: u.id,
        email: u.email,
        username: u.username,
        image: u.image,
      }));

      return res.status(201).json({
        success: true,
        message: "Users registered successfully",
        data: safeUsers,
      });
    } catch (err) {
      await t.rollback();
      console.error("[UserController.addBulk] error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  }

  static async delete(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id))
        return res
          .status(400)
          .json({ success: false, message: "Invalid user ID" });

      const deleted = await User.destroy({ where: { id } });
      if (!deleted)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      return res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (err) {
      console.error("[UserController.delete] error:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
    }
  }

  static async edit(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id))
        return res
          .status(400)
          .json({ success: false, message: "Invalid user ID" });

      const { email, password, username, image } = req.body;
      const updateData = {};
      if (email) updateData.email = email;
      if (username) updateData.username = username;
      if (image) updateData.image = image;
      if (password) updateData.password = await encryptPwd(password);

      const [updatedCount] = await User.update(updateData, { where: { id } });
      if (updatedCount === 0) {
        return res
          .status(404)
          .json({
            success: false,
            message: "User not found or no changes made",
          });
      }

      return res
        .status(200)
        .json({ success: true, message: "User updated successfully" });
    } catch (err) {
      console.error("[UserController.edit] error:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
    }
  }

  static async search(req, res) {
    try {
      const searchQuery = req.query.username || "";
      const users = await User.findAll({
        where: { username: { [Op.iLike]: `%${searchQuery}%` } }, // NB: iLike hanya untuk Postgres
      });

      return res
        .status(200)
        .json({ success: true, message: "Search completed", data: users });
    } catch (err) {
      console.error("[UserController.search] error:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      const isValid = await comparePwd(password, user.password);
      if (!isValid) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      const access_token = tokenGenerator({
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
      });

      return res
        .status(200)
        .json({ success: true, message: "Login successful", access_token });
    } catch (err) {
      console.error("[UserController.login] error:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Internal server error",
          error: err.message,
        });
    }
  }
}

module.exports = { UserController };
