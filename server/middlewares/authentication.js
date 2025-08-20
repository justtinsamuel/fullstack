/**
 * middlewares/authentication.js
 *
 * Middleware untuk memverifikasi JWT di setiap request yang butuh authentication.
 * - Mencari token di header 'Authorization: Bearer <token>' (prioritas)
 * - Fallback ke header 'access_token' (jika client masih memakai itu)
 * - Jika valid -> set req.userData = decodedPayload
 * - Jika tidak ada token atau invalid -> return 401
 */

const { tokenVerifier } = require("../helpers/jwt");

const authentication = (req, res, next) => {
  console.log("[Auth] authentication middleware");

  // Ambil token dari header Authorization atau access_token
  let token = null;

  // Standar modern: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers.access_token) {
    // Fallback untuk kompatibilitas
    token = req.headers.access_token;
  }

  // Jika token tidak ditemukan -> 401 Unauthorized
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token not found",
    });
  }

  try {
    // Verifikasi token (tokenVerifier akan melempar jika invalid/expired)
    const decoded = tokenVerifier(token);

    // Simpan decoded payload di request agar middleware/controller berikutnya bisa akses
    req.userData = decoded;

    // Lanjut ke route handler
    next();
  } catch (err) {
    console.error("[Auth] token verification failed:", err.message || err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};

module.exports = {
  authentication,
};
