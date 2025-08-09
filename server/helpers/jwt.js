/**
 * helpers/jwt.js
 *
 * Helper untuk membuat dan memverifikasi JWT.
 * - Secret dan expires diambil dari environment variable.
 * - tokenGenerator membuat token; tokenVerifier verifikasi dan melempar error jika invalid/expired.
 */

const jwt = require("jsonwebtoken");

// Ambil dari env, fallback ke default (default hanya untuk development — jangan gunakan di production)
const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d"; // contoh: '1h', '1d'

/**
 * tokenGenerator
 * - Membuat token JWT dari payload (sebaiknya hanya kirim data minimum yang diperlukan)
 * @param {Object} payload - contohnya: { id, username, email }
 * @returns {string} JWT token
 */
const tokenGenerator = (payload) => {
  // jwt.sign bisa melempar error bila secret invalid; biarkan throw supaya caller bisa handle.
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return token;
};

/**
 * tokenVerifier
 * - Memverifikasi token, mengembalikan decoded payload.
 * - Melempar Error jika token invalid/expired — middleware harus catch ini.
 * @param {string} token
 * @returns {Object} decoded payload
 */
const tokenVerifier = (token) => {
  if (!token) throw new Error("Token is required for verification");
  // jwt.verify akan melempar jika token tidak valid atau sudah expired.
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded;
};

module.exports = {
  tokenGenerator,
  tokenVerifier,
};
