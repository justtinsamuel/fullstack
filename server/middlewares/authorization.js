/**
 * middlewares/authorization.js
 *
 * Middleware untuk memeriksa apakah user berhak mengakses resource tertentu.
 * Contoh implementasi: hanya pemilik Item yang bisa update/delete item tersebut.
 *
 * Asumsi:
 * - authentication middleware sudah dijalankan sebelumnya (req.userData tersedia)
 * - Item model punya kolom UserId untuk relasi ownership
 */

const { Item } = require("../models");

const authorization = async (req, res, next) => {
  console.log("[AuthZ] authorization middleware");

  try {
    // Ambil id resource dari params (biasanya route: /items/:id)
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    // Pastikan authentication sudah menyediakan userData
    if (!req.userData || !req.userData.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const currentUserId = req.userData.id;

    // Cari resource di DB
    const item = await Item.findByPk(id);

    // Jika resource tidak ditemukan -> 404
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Cek ownership (sesuaikan field UserId dengan definisi model kamu)
    // Jika kolom di model bernama userId (camelCase), ganti item.UserId -> item.userId
    if (item.UserId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this resource",
      });
    }

    // Jika lolos, lanjutkan
    next();
  } catch (err) {
    console.error("[AuthZ] error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message || err,
    });
  }
};

module.exports = {
  authorization,
};
