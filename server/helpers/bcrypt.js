/**
 * helpers/bcrypt.js
 *
 * Fungsi untuk meng-hash password dan membandingkannya.
 * Menggunakan versi asynchronous agar tidak blocking event-loop.
 */

const bcrypt = require("bcrypt");

// Salt rounds: 10 biasa dipakai sebagai trade-off keamanan vs performance.
// Kalau server CPU rendah, jangan set terlalu tinggi.
const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

/**
 * encryptPwd
 * - Meng-hash password plain text.
 * @param {string} plainPassword
 * @returns {Promise<string>} hashed password
 */
const encryptPwd = async (plainPassword) => {
  if (!plainPassword) throw new Error("Password is required to encrypt");
  // bcrypt.hash melakukan pekerjaan CPU-bound secara async (non-blocking).
  const hashed = await bcrypt.hash(plainPassword, saltRounds);
  return hashed;
};

/**
 * comparePwd
 * - Membandingkan plain password dengan hashed password di DB.
 * - Mengembalikan boolean true/false.
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
const comparePwd = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) return false;
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (err) {
    // Log detail error untuk debug; kembalikan false untuk keamanan.
    console.error("comparePwd error:", err);
    return false;
  }
};

module.exports = {
  encryptPwd,
  comparePwd,
};
