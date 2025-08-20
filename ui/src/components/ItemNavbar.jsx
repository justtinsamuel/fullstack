import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, PlusSquare, FileText, Edit } from "lucide-react";

const ItemNavbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek status login hanya sekali saat component mount
    const user = localStorage.getItem("user");
    try {
      // Validasi apakah user data berbentuk JSON yang valid
      const parsedUser = user ? JSON.parse(user) : null;
      setIsLoggedIn(!!parsedUser);
    } catch (err) {
      console.error("Corrupted user data in localStorage", err);
      // Kalau datanya corrupted, kita clear agar tidak jadi celah
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <div className="flex space-x-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-200 hover:text-blue-400 transition"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>

            <Link
              to="create/1"
              className="flex items-center gap-2 text-gray-200 hover:text-blue-400 transition"
            >
              <PlusSquare size={18} />
              <span>Create</span>
            </Link>

            <Link
              to="detail/1"
              className="flex items-center gap-2 text-gray-200 hover:text-blue-400 transition"
            >
              <FileText size={18} />
              <span>Detail</span>
            </Link>

            <Link
              to="update"
              className="flex items-center gap-2 text-gray-200 hover:text-blue-400 transition"
            >
              <Edit size={18} />
              <span>Update</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ItemNavbar;
