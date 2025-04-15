import Product from "../../models/Product.js";
import ProductItem from "../../models/ProductItem.js";
import ProductImage from "../../models/ProductImage.js";
import Inventory from "../../models/Inventory.js";
import Category from "../../models/Category.js";
import Discount from "../../models/Discount.js";
import DiscountProduct from "../../models/DiscountProduct.js";
import Settings from "../../models/Settings.js";
const getProducts = async (req, res) => {
  try {
    const [lowStockSetting, outOfStockSetting] = await Promise.all([
      Settings.findOne({ where: { setting_key: "low_stock_threshold" } }),
      Settings.findOne({ where: { setting_key: "out_of_stock_threshold" } }),
    ]);

    const lowThreshold = parseInt(lowStockSetting?.setting_value || "20");
    const outThreshold = parseInt(outOfStockSetting?.setting_value || "5");

    const products = await Product.findAll({
      attributes: ["id", "name", "description", "image", "price", "category_id", "isDeleted", "isActive", "status", "createdAt", "updatedAt"],
      include: [
        {
          model: ProductItem,
          attributes: ["id", "sku", "price"],
          include: [
            {
              model: Inventory,
              attributes: ["quantity"],
            },
          ],
        },
        {
          model: Discount,
          through: DiscountProduct,
          attributes: ["id", "code", "discount_type", "discount_value", "start_date", "end_date"],
        }
      ],
    });

    const formattedProducts = await Promise.all(products.map(async (product) => {
      const productData = product.toJSON();

      let inventory = 0;
      if (productData.ProductItems) {
        productData.ProductItems.forEach(item => {
          if (item.Inventory?.quantity) {
            inventory += item.Inventory.quantity;
          }
        });
      }

      productData.inventory = inventory;

      // 👇 Tính status mong muốn
      let expectedStatus = "in stock";
      if (inventory <= outThreshold) {
        expectedStatus = "out of stock";
      } else if (inventory <= lowThreshold) {
        expectedStatus = "low stock";
      }


      // 👇 Nếu khác status hiện tại, cập nhật lại
      if (product.status !== expectedStatus) {
        await Product.update(
          { status: expectedStatus },
          { where: { id: product.id } }
        );
        productData.status = expectedStatus; // cập nhật trong kết quả trả ra luôn
      }

      // Tính giá sau khi áp dụng giảm giá
      const originalPrice = parseFloat(productData.price);
      let salePrice = null;

      const currentDate = new Date();
      const activeDiscounts = productData.Discounts?.filter(discount =>
        new Date(discount.start_date) <= currentDate &&
        new Date(discount.end_date) >= currentDate
      ) || [];

      if (activeDiscounts.length > 0) {
        const discount = activeDiscounts[0];
        const discountValue = parseFloat(discount.discount_value);
        if (discount.discount_type === 'percentage') {
          salePrice = originalPrice - (originalPrice * (discountValue / 100));
        } else if (discount.discount_type === 'fixed') {
          salePrice = Math.max(0, originalPrice - discountValue);
        }
        salePrice = Math.round(salePrice * 100) / 100;
      }

      productData.salePrice = salePrice;

      return productData;
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách sản phẩm" });
  }
};


const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      attributes: [
        "id",
        "name",
        "description",
        "summary",
        "slug",
        "image",
        "isDeleted",
        "isActive",
        "price",
        "category_id",
        "sku",
        "barcode",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: ProductItem,
          attributes: [
            "id",
            "sku",
            "price",
            "weight",
            "dimensions",
            "attributes",
            "color",
            "size",
            "name",
            "barcode",
          ],
          include: [
            {
              model: ProductImage,
              attributes: ["id", "image_url"],
            },
            {
              model: Inventory,
              attributes: ["quantity"],
            },
          ],
        },
        {
          model: Discount,
          through: DiscountProduct,
          attributes: [
            "id",
            "code",
            "discount_type",
            "discount_value",
            "start_date",
            "end_date",
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }

    const productData = product.toJSON();

    // Tính tổng tồn kho
    let inventory = 0;
    productData.ProductItems?.forEach(item => {
      if (item.Inventory && item.Inventory.quantity) {
        inventory += item.Inventory.quantity;
      }
    });
    productData.inventory = inventory;

    // Cập nhật lại status nếu cần
    const shouldBeStatus = inventory > 0 ? 'in stock' : 'out of stock';
    if (product.status !== shouldBeStatus) {
      await product.update({ status: shouldBeStatus });
      productData.status = shouldBeStatus;
    }

    // Tìm ảnh chính nếu chưa có image
    const primaryImage = product.ProductImages?.find(img => img) || product.ProductImages?.[0];
    if (primaryImage && !productData.image) {
      productData.image = primaryImage.image_url;
    }

    // Thêm min/max price
    if (productData.ProductItems && productData.ProductItems.length > 0) {
      const prices = productData.ProductItems.map(item => parseFloat(item.price));
      productData.min_price = Math.min(...prices);
      productData.max_price = Math.max(...prices);
    }

    // Tính salePrice nếu có giảm giá
    const originalPrice = parseFloat(productData.price);
    let salePrice = originalPrice;

    const currentDate = new Date();
    const activeDiscounts = productData.Discounts?.filter(discount =>
      new Date(discount.start_date) <= currentDate &&
      new Date(discount.end_date) >= currentDate
    ) || [];

    if (activeDiscounts.length > 0) {
      const discount = activeDiscounts[0];
      const discountValue = parseFloat(discount.discount_value);

      if (discount.discount_type === 'percentage') {
        salePrice = originalPrice - (originalPrice * (discountValue / 100));
      } else if (discount.discount_type === 'fixed') {
        salePrice = Math.max(0, originalPrice - discountValue);
      }

      salePrice = Math.round(salePrice * 100) / 100;
    }

    productData.salePrice = salePrice;

    res.status(200).json({
      success: true,
      data: productData
    });

  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin sản phẩm"
    });
  }
};

const createProduct = async (req, res) => {

  
  try {
    // Lấy dữ liệu cơ bản từ req.body
    const {
      name, 
      description, 
      summary, 
      slug, 
      status, 
      category_id,
      price, 
      salePrice,
      sku,
      barcode,
      inventory,
      isActive
    } = req.body;

    // Lấy đường dẫn hình ảnh từ file upload
    const imagePath = req.files && req.files.image && req.files.image[0] 
      ? `/uploads/product/${req.files.image[0].filename}` 
      : null;
      console.log(imagePath);
    // Tạo sản phẩm mới
    const newProduct = await Product.create({
      name,
      description,
      summary,
      slug,
      image: imagePath,
      status,
      category_id: Number(category_id),
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      sku,
      barcode,
      inventory: Number(inventory),
      isActive: isActive === 'true'
    });

    // Xử lý product items từ FormData
    // Phân tích các trường có cấu trúc productItem_index_property
    const productItemsMap = new Map();
    
    // Lặp qua tất cả các keys trong req.body để tìm và nhóm các productItem
    Object.keys(req.body).forEach(key => {
      if (key.startsWith('productItem_')) {
        const parts = key.split('_');
        const index = parts[1];
        const property = parts.slice(2).join('_');
        
        if (!productItemsMap.has(index)) {
          productItemsMap.set(index, {});
        }
        
        productItemsMap.get(index)[property] = req.body[key];
      }
    });

    // Xử lý các file images cho product items
    if (req.files) {
      // Lặp qua tất cả các keys trong req.files để tìm các file ảnh của productItem
      Object.keys(req.files).forEach(fieldname => {
        if (fieldname.startsWith('productItem_')) {
          const match = fieldname.match(/^productItem_(\d+)_image$/);
          if (match) {
            const index = match[1];
            const files = req.files[fieldname];
            
            if (!productItemsMap.has(index)) {
              productItemsMap.set(index, {});
            }
            
            if (!productItemsMap.get(index).images) {
              productItemsMap.get(index).images = [];
            }
            
            files.forEach(file => {
              productItemsMap.get(index).images.push(`/uploads/product_items/${file.filename}`);
            });
          }
        }
      });
    }

    // Tạo các product items
    for (const [_, itemData] of productItemsMap) {
      const createdItem = await ProductItem.create({
        product_id: newProduct.id,
        name: itemData.name || '',
        sku: itemData.sku || '',
        price: Number(itemData.price) || 0,
        weight: itemData.weight || null,
        dimensions: itemData.dimensions || null,
        attributes: itemData.attributes || '',
        status: itemData.status || 'in stock',
        color: itemData.color || '',
        size: itemData.size || '',
        barcode: itemData.barcode || '',
        Inventory: Number(itemData.inventory) || 0
      });

      // Xử lý hình ảnh cho product item
      if (itemData.images && itemData.images.length) {
        for (const imageUrl of itemData.images) {
          await ProductImage.create({
            product_item_id: createdItem.id,
            image_url: imageUrl,
          });
        }
      }
      
      // Xử lý image_url từ FormData
      for (let i = 0; i < 10; i++) { // Giả sử tối đa 10 ảnh
        const imageUrlKey = `image_url_${i}`;
        if (itemData[imageUrlKey]) {
          await ProductImage.create({
            product_item_id: createdItem.id,
            image_url: itemData[imageUrlKey],
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: "Thêm sản phẩm thành công",
      data: newProduct
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm sản phẩm"
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy dữ liệu cơ bản từ req.body
    const {
      name,
      description,
      summary,
      slug,
      status,
      category_id,
      price,
      salePrice,
      sku,
      barcode,
      inventory,
      isActive,
      isDeleted
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }

    // Xử lý hình ảnh
    const imagePath = req.file ? `/uploads/product/${req.file.filename}` : req.body.image || product.image;
    console.log(imagePath);
    // Cập nhật sản phẩm
    await product.update({
      name,
      description,
      summary,
      slug,
      image: imagePath,
      status,
      category_id: Number(category_id),
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      sku,
      barcode,
      inventory: Number(inventory),
      isActive: isActive === 'true',
      isDeleted: isDeleted === 'true'
    });

    // Xử lý product items từ FormData - tương tự như trong createProduct
    const productItemsMap = new Map();

    Object.keys(req.body).forEach(key => {
      if (key.startsWith('productItem_')) {
        const parts = key.split('_');
        const index = parts[1];
        const property = parts.slice(2).join('_');

        if (!productItemsMap.has(index)) {
          productItemsMap.set(index, {});
        }

        productItemsMap.get(index)[property] = req.body[key];
      }
    });

    // Xử lý files cho productItems
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        const filename = file.fieldname;
        if (filename.startsWith('productItem_')) {
          const parts = filename.split('_');
          const index = parts[1];

          if (!productItemsMap.has(index)) {
            productItemsMap.set(index, {});
          }

          if (!productItemsMap.get(index).images) {
            productItemsMap.get(index).images = [];
          }

          productItemsMap.get(index).images.push(`/uploads/product_items/${file.filename}`);
        }
      });
    }

    // Cập nhật hoặc tạo mới các product items
    for (const [_, itemData] of productItemsMap) {
      let productItem = null;

      if (itemData.id) {
        productItem = await ProductItem.findByPk(itemData.id);
        if (productItem) {
          await productItem.update({
            name: itemData.name || productItem.name,
            sku: itemData.sku || productItem.sku,
            price: Number(itemData.price) || productItem.price,
            weight: itemData.weight || productItem.weight,
            dimensions: itemData.dimensions || productItem.dimensions,
            attributes: itemData.attributes || productItem.attributes,
            status: itemData.status || productItem.status,
            color: itemData.color || productItem.color,
            size: itemData.size || productItem.size,
            barcode: itemData.barcode || productItem.barcode,
            Inventory: Number(itemData.inventory) || productItem.Inventory || 0
          });
        }
      } else {
        productItem = await ProductItem.create({
          product_id: product.id,
          name: itemData.name || '',
          sku: itemData.sku || '',
          price: Number(itemData.price) || 0,
          weight: itemData.weight || null,
          dimensions: itemData.dimensions || null,
          attributes: itemData.attributes || '',
          status: itemData.status || 'in stock',
          color: itemData.color || '',
          size: itemData.size || '',
          barcode: itemData.barcode || '',
          Inventory: Number(itemData.inventory) || 0
        });
      }

      // Xử lý hình ảnh cho product item
      if (itemData.images && itemData.images.length) {
        // Xóa tất cả hình ảnh cũ nếu cần
        await ProductImage.destroy({ where: { product_item_id: productItem.id } });

        for (const imageUrl of itemData.images) {
          await ProductImage.create({
            product_item_id: productItem.id,
            image_url: imageUrl,
          });
        }
      }

      // Xử lý image_url từ FormData
      let hasNewImages = false;
      for (let i = 0; i < 10; i++) { // Giả sử tối đa 10 ảnh
        const imageUrlKey = `image_url_${i}`;
        if (itemData[imageUrlKey]) {
          if (!hasNewImages) {
            // Chỉ xóa hình ảnh cũ nếu có hình ảnh mới và chưa xóa trước đó
            await ProductImage.destroy({ where: { product_item_id: productItem.id } });
            hasNewImages = true;
          }

          await ProductImage.create({
            product_item_id: productItem.id,
            image_url: itemData[imageUrlKey],
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật sản phẩm"
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }

    await product.update({
      isDeleted: true,
      status: 'deleted'
    });

    res.status(200).json({
      success: true,
      message: "Xóa sản phẩm thành công"
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa sản phẩm"
    });
  }
};


const productController = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productController;