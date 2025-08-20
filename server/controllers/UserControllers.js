/**
 * controllers/userController.js
 *
 * Menangani register, login, dan beberapa operasi user dasar.
 * Semua method menampilkan response JSON dengan format konsisten:
 * { success: boolean, message: string, data?: any, error?: string }
 *
 * Perhatikan:
 * - Pastikan model User & Profile sesuai dengan definisi Sequelize-mu.
 * - Field password selalu di-hash sebelum disimpan.
 * - Token yang digenerate hanya mengandung data minimal (id, username, email, image).
 */

const { Op } = require("sequelize");
const { User, Profile } = require("../models");
const { encryptPwd, comparePwd } = require("../helpers/bcrypt");
const { tokenGenerator } = require("../helpers/jwt");

class UserController {
  /**
   * getUsers
   * - Mengambil semua user beserta profile terkait.
   */
  static async getUsers(req, res) {
    try {
      const users = await User.findAll({
        include: [Profile],
      });

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

  /**
   * getUserById
   * - Mengambil user berdasarkan id.
   */
  static async getUserById(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const user = await User.findOne({
        where: { id },
        include: [Profile],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
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
   * register / add
   * - Menambahkan user baru.
   * - Steps:
   *   1. Validasi minimal (pastikan email & password ada)
   *   2. Hash password
   *   3. Buat Profile default (jika kamu mau membuat profile otomatis)
   *   4. Simpan User (jangan kirim password ke client)
   */
  static async add(req, res) {
    try {
      const { email, password, username, image } = req.body;

      // Validasi sederhana
      if (!email || !password || !username) {
        return res.status(400).json({
          success: false,
          message: "email, username and password are required",
        });
      }

      // Cek apakah email sudah terdaftar
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      // Hash password sebelum disimpan
      const hashedPassword = await encryptPwd(password);

      // Buat profile default (opsional — sesuaikan kebutuhan)
      const profile = await Profile.create({
        /* default fields if any */
      });

      // Simpan user baru
      const newUser = await User.create({
        email,
        password: hashedPassword,
        username,
        image,
        ProfileId: profile.id,
      });

      // Response tanpa password
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
   * delete
   * - Menghapus user berdasarkan id.
   */
  static async delete(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const deleted = await User.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (err) {
      console.error("[UserController.delete] error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  }

  /**
   * edit
   * - Meng-update data user. Jika password disertakan, akan di-hash dulu.
   */
  static async edit(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const { email, password, username, image } = req.body;

      const updateData = { email, username, image };

      // Jika user ingin update password, hash dulu
      if (password) {
        updateData.password = await encryptPwd(password);
      }

      const [updatedCount] = await User.update(updateData, { where: { id } });

      if (updatedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found or no changes made",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
      });
    } catch (err) {
      console.error("[UserController.edit] error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  }

  /**
   * search
   * - Cari user berdasarkan username (case-insensitive)
   */
  static async search(req, res) {
    try {
      const searchQuery = req.query.username || "";
      const users = await User.findAll({
        where: {
          username: {
            [Op.iLike]: `%${searchQuery}%`,
          },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Search completed",
        data: users,
      });
    } catch (err) {
      console.error("[UserController.search] error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  }

  /**
   * login
   * - Validasi credential, jika valid return access_token (JWT)
   * - Token hanya berisi data yang diperlukan (misalnya id, username, email, image)
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Cari user berdasarkan email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        // Untuk keamanan, sebaiknya pesan tidak terlalu detail (avoid user enumeration)
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Bandingkan password (plain vs hashed)
      const isValid = await comparePwd(password, user.password);

      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate token dengan data minimal
      const access_token = tokenGenerator({
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        access_token,
      });
    } catch (err) {
      console.error("[UserController.login] error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  }
}

module.exports = {UserController};
