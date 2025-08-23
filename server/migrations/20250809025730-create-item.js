"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: Sequelize.STRING,
      category: Sequelize.STRING,
      price: Sequelize.INTEGER,
      stock: Sequelize.INTEGER,
      image: Sequelize.STRING,

      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // tabel Users
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      TypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Types", // ini penting, tabel nya "Types" (plural)
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      ProfileId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Profiles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      BrandId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Brands",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Items");
  },
};
