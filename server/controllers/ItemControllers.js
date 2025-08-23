// const { Op } = require("sequelize");
// const { Item, User, Type, Brand } = require("../models");

// class ItemController {
//   static async getItems(req, res) {
//     try {
//       let items = await Item.findAll({
//         include: [User, Type, Brand],
//       });
//       res.status(200).json(items);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }

//   static async getItemById(req, res) {
//     try {
//       const id = +req.params.id;
//       let result = await Item.findOne({
//         where: { id },
//         include: [User, Type, Brand],
//       });
//       res.status(200).json(result);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
//   static async add(req, res) {
//     try {
//       const { name, category, price, stock, image, BrandId, TypeId } = req.body;
//       // let UserId = +req.userData.id;
//       let result = await Item.create({
//         name,
//         category,
//         price,
//         stock,
//         image,
//         UserId: UserId || null,
//         TypeId,
//         BrandId,
//       });
//       res.status(201).json(result);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }

//   static async delete(req, res) {
//     try {
//       const id = +req.params.id;
//       let result = await Item.destroy({
//         where: { id },
//       });
//       res.status(200).json(result);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
//   static async edit(req, res) {
//     try {
//       const id = +req.params.id;
//       const { name, category, price, stock, image, UserId, TypeId, BrandId } =
//         req.body;
//       let result = await Item.update(
//         {
//           name,
//           category,
//           price,
//           stock,
//           image,
//           UserId,
//           TypeId,
//           BrandId,
//         },
//         {
//           where: { id },
//         }
//       );
//       res.status(201).json(result);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
//   static async search(req, res) {
//     try {
//       const searchQuery = req.query.name;
//       let result = await Item.findAll({
//         where: {
//           name: {
//             [Op.iLike]: `%${searchQuery}%`,
//           },
//         },
//       });
//       res.status(200).json(result);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// }

// module.exports = {ItemController};

const { Op } = require("sequelize");
const { Item, User, Type, Brand } = require("../models");

class ItemController {
  static async getItems(req, res) {
    try {
      let items = await Item.findAll({
        include: [User, Type, Brand],
      });
      res.status(200).json(items);
    } catch (err) {
      console.error("🔥 Error in getItems:", err);
      res.status(500).json({ message: err.message });
    }
  }

  static async getItemById(req, res) {
    try {
      const id = +req.params.id;
      let result = await Item.findOne({
        where: { id },
        include: [User, Type, Brand],
      });
      res.status(200).json(result);
    } catch (err) {
      console.error("🔥 Error in getItemById:", err);
      res.status(500).json({ message: err.message });
    }
  }

  static async add(req, res) {
    try {
      const { name, category, price, stock, image, BrandId, TypeId, UserId } =
        req.body;

      let result = await Item.create({
        name,
        category,
        price,
        stock,
        image,
        UserId: UserId,
        TypeId,
        BrandId,
      });

      res.status(201).json(result);
    } catch (err) {
      console.error("🔥 Error in add Item:", err);
      res.status(500).json({ message: err.message, stack: err.stack });
    }
  }

  static async addBulk(req, res) {
    try {
      const items = req.body; // harus array of item objects

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Request body must be a non-empty array of items",
        });
      }

      // Validasi sederhana
      for (const item of items) {
        if (!item.name || !item.category || !item.price || !item.stock) {
          return res.status(400).json({
            success: false,
            message: "Each item must have name, category, price, and stock",
          });
        }
      }

      // Bulk create
      const result = await Item.bulkCreate(items, { returning: true });

      res.status(201).json({
        success: true,
        message: "Items added successfully",
        data: result,
      });
    } catch (err) {
      console.error("🔥 Error in addBulk Item:", err);
      res.status(500).json({ message: err.message, stack: err.stack });
    }
  }

  static async delete(req, res) {
    try {
      const id = +req.params.id;
      let result = await Item.destroy({
        where: { id },
      });
      res.status(200).json(result);
    } catch (err) {
      console.error("🔥 Error in delete Item:", err);
      res.status(500).json({ message: err.message });
    }
  }

  static async edit(req, res) {
    try {
      const id = +req.params.id;
      const { name, category, price, stock, image, UserId, TypeId, BrandId } =
        req.body;

      let result = await Item.update(
        { name, category, price, stock, image, UserId, TypeId, BrandId },
        { where: { id } }
      );

      res.status(200).json(result);
    } catch (err) {
      console.error("🔥 Error in edit Item:", err);
      res.status(500).json({ message: err.message });
    }
  }

  static async search(req, res) {
    try {
      const searchQuery = req.query.name;
      let result = await Item.findAll({
        where: {
          name: {
            [Op.iLike]: `%${searchQuery}%`,
          },
        },
      });
      res.status(200).json(result);
    } catch (err) {
      console.error("🔥 Error in search Item:", err);
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = { ItemController };
