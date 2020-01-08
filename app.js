const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Executes for every request
app.use((req, res, next) => {
  User.findById(1)
    .then(user => {
      // Store the user in request
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// It adds userId field to products Table as a foreign key
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });//If a user is deleted, product is also deleted
User.hasMany(Product);

//It will add a new field(userId) to cart
User.hasOne(Cart);
Cart.belongsTo(User);

// Many-> Many relationship, One cart can hold multiple products, One product can be a part of multiple carts
// Many -> Many works only through intermediate table(CartItem) that connects them. It stores productId,cartId
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// 1-> Many , One user can have many orders
Order.belongsTo(User);
User.hasMany(Order);

//Many -> Many
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

//Creates tables for all the models => runs after npm start
 // .sync({ force: true }) -->Overrides the tables
// Executes only when npm start runs
sequelize
  .sync()
  .then(result => {
    return User.findById(1);
    // console.log(result);
  })
  .then(user => {
    if (!user) { //if there is no user we create a user
      return User.create({ name: 'Max', email: 'test@test.com' });
    }
    return user;
  })
  .then(user => {
    // create a cart for the user
    return user.createCart();
  })
  .then(cart => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
