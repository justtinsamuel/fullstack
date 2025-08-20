import React, { useEffect, useState } from "react";
import axios from "axios";

const HomeItem = () => {
  const URL = "http://localhost:3000/api";
  const [coffees, setCoffees] = useState([]);

  const getItems = async () => {
    try {
      const result = await axios.get(`${URL}/items`);
      console.log("API result:", result.data);

      // cek apakah result.data array atau object
      if (Array.isArray(result.data)) {
        setCoffees(result.data);
      } else if (result.data.data) {
        setCoffees(result.data.data);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4">Table</h3>

      <div className="overflow-x-auto rounded-2xl shadow">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 border-b">#</th>
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Category</th>
              <th className="px-6 py-3 border-b">Price</th>
              <th className="px-6 py-3 border-b">Stock</th>
              <th className="px-6 py-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coffees.length > 0 ? (
              coffees.map((coffee, index) => {
                const { id, name, category, price, stock } = coffee;
                return (
                  <tr key={id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">{name}</td>
                    <td className="px-6 py-3">{category}</td>
                    <td className="px-6 py-3">${price}</td>
                    <td className="px-6 py-3">{stock}</td>
                    <td className="px-6 py-3">
                      <button className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-3 text-gray-500">
                  There's no data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomeItem;
