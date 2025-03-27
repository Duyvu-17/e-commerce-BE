import sequelize from "../../config/database.js";
import Cart from "../../models/Cart.js";
import CartItem from "../../models/CartItem.js";
import ProductItem from "../../models/ProductItem.js";

const cartController = {
  getCart: async (req, res) => {
    try {
      const customerId = req.user.id;
      const cart = await Cart.findOne({
        where: { customerId },
        include: [{ model: CartItem, as: "items", include: [{ model: ProductItem, as: "productItem" }] }],
      });

      if (!cart || !cart.items.length) {
        return res.status(404).json({ message: "Giỏ hàng trống." });
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  addToCart: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const customerId = req.user.id;
      const { productItemId, quantity } = req.body;

      if (!productItemId || isNaN(productItemId)) {
        return res.status(400).json({ message: "ID sản phẩm không hợp lệ." });
      }

      if (quantity <= 0) {
        return res.status(400).json({ message: "Số lượng phải lớn hơn 0." });
      }

      const productItem = await ProductItem.findByPk(productItemId, { transaction });
      if (!productItem) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại." });
      }

      if (productItem.stock === 0) {
        return res.status(400).json({ message: "Sản phẩm đã hết hàng." });
      }

      let cart = await Cart.findOne({ where: { customerId }, transaction });
      if (!cart) {
        cart = await Cart.create({ customerId }, { transaction });
      }

      let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productItemId }, transaction });

      const newQuantity = cartItem ? cartItem.quantity + quantity : quantity;
      if (newQuantity > productItem.stock) {
        return res.status(400).json({
          message: `Số lượng tồn kho không đủ. Chỉ còn ${productItem.stock} sản phẩm.`,
        });
      }

      if (cartItem) {
        cartItem.quantity = newQuantity;
        await cartItem.save({ transaction });
      } else {
        cartItem = await CartItem.create({ cartId: cart.id, productItemId, quantity }, { transaction });
      }

      // Giảm số lượng tồn kho sau khi thêm vào giỏ hàng
      productItem.stock -= quantity;
      await productItem.save({ transaction });

      await transaction.commit();
      res.json(cartItem);
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  updateCartItem: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (quantity <= 0) {
        return res.status(400).json({ message: "Số lượng phải lớn hơn 0." });
      }

      const cartItem = await CartItem.findByPk(itemId, { transaction });
      if (!cartItem) {
        return res.status(404).json({ message: "CartItem không tồn tại." });
      }

      const productItem = await ProductItem.findByPk(cartItem.productItemId, { transaction });
      if (!productItem) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại." });
      }

      const difference = quantity - cartItem.quantity;
      if (difference > productItem.stock) {
        return res.status(400).json({
          message: `Số lượng tồn kho không đủ. Chỉ còn ${productItem.stock} sản phẩm.`,
        });
      }

      // Cập nhật số lượng trong giỏ hàng
      cartItem.quantity = quantity;
      await cartItem.save({ transaction });

      // Cập nhật số lượng tồn kho
      productItem.stock -= difference;
      await productItem.save({ transaction });

      await transaction.commit();
      res.json(cartItem);
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  removeCartItem: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { itemId } = req.params;
      const cartItem = await CartItem.findByPk(itemId, { transaction });
      if (!cartItem) {
        return res.status(404).json({ message: "CartItem không tồn tại." });
      }

      const cartId = cartItem.cartId;
      const productItem = await ProductItem.findByPk(cartItem.productItemId, { transaction });

      // Hoàn lại số lượng sản phẩm vào kho
      if (productItem) {
        productItem.stock += cartItem.quantity;
        await productItem.save({ transaction });
      }

      await cartItem.destroy({ transaction });

      // Kiểm tra nếu giỏ hàng rỗng thì xóa luôn
      const remainingItems = await CartItem.count({ where: { cartId }, transaction });
      if (remainingItems === 0) {
        await Cart.destroy({ where: { id: cartId }, transaction });
      }

      await transaction.commit();
      res.json({ message: "Item removed from cart." });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  clearCart: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const customerId = req.user.id;
      const cart = await Cart.findOne({ where: { customerId }, transaction });
      if (!cart) {
        return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
      }

      const cartItems = await CartItem.findAll({ where: { cartId: cart.id }, transaction });

      // Hoàn trả số lượng sản phẩm vào kho
      for (const item of cartItems) {
        const productItem = await ProductItem.findByPk(item.productItemId, { transaction });
        if (productItem) {
          productItem.stock += item.quantity;
          await productItem.save({ transaction });
        }
      }

      await CartItem.destroy({ where: { cartId: cart.id }, transaction });
      await Cart.destroy({ where: { id: cart.id }, transaction });

      await transaction.commit();
      res.json({ message: "Giỏ hàng đã được xóa." });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

export default cartController;
