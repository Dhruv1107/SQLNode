const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// CartItem is a combination of product and the id of the cart in which product lies and the quantity
// id,quantity,cartId,productId
const CartItem = sequelize.define('cartItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER
});

module.exports = CartItem;
