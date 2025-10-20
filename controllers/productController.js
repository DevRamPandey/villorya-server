const Product=require('../models/product');

// Create a new product
 const createProduct = async (req, res) => {
  try {
    const {
      title,
      variety,
      itemForm,
      dietType,
      useBy,
      netQuantities,
      coupons,
      images,
      videos,
      labReports,
      aboutItem,
      technicalDetails,
      additionalInfo,
      ingredients,
      legalDisclaimer,
      productDescription,
    } = req.body;

    // 🧩 1️⃣ Validate required fields
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!variety) missingFields.push("variety");
    if (!itemForm) missingFields.push("itemForm");
    if (!dietType) missingFields.push("dietType");
    if (!useBy) missingFields.push("useBy");
    if (!aboutItem) missingFields.push("aboutItem");
    if (!productDescription) missingFields.push("productDescription");
    if (!images || !Array.isArray(images) || images.length === 0)
      missingFields.push("images (at least one required)");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing or invalid fields: ${missingFields.join(", ")}`,
      });
    }

    // 🧩 2️⃣ Validate netQuantities
    if (!Array.isArray(netQuantities) || netQuantities.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one net quantity (quantity + price) is required",
      });
    }

    for (let i = 0; i < netQuantities.length; i++) {
      const item = netQuantities[i];
      if (!item.quantity || !item.price) {
        return res.status(400).json({
          success: false,
          message: `Invalid netQuantities at index ${i}: both quantity and price are required`,
        });
      }
      if (isNaN(item.price) || Number(item.price) < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price at netQuantities[${i}] — must be a positive number`,
        });
      }
    }

    // 🧩 3️⃣ Validate images and videos URLs (basic check)
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (images.some((url) => !isValidUrl(url))) {
      return res.status(400).json({
        success: false,
        message: "One or more image URLs are invalid",
      });
    }

    if (videos && Array.isArray(videos) && videos.some((url) => !isValidUrl(url))) {
      return res.status(400).json({
        success: false,
        message: "One or more video URLs are invalid",
      });
    }

    // 🧩 4️⃣ Validate optional nested arrays (labReports, technicalDetails, additionalInfo)
    if (labReports && Array.isArray(labReports)) {
      for (let i = 0; i < labReports.length; i++) {
        const report = labReports[i];
        if (!report.title || !report.file) {
          return res.status(400).json({
            success: false,
            message: `Invalid labReport at index ${i}: title and file are required`,
          });
        }
        if (!isValidUrl(report.file)) {
          return res.status(400).json({
            success: false,
            message: `Invalid labReport file URL at index ${i}`,
          });
        }
      }
    }

    if (technicalDetails && Array.isArray(technicalDetails)) {
      for (let i = 0; i < technicalDetails.length; i++) {
        const tech = technicalDetails[i];
        if (!tech.key || !tech.value) {
          return res.status(400).json({
            success: false,
            message: `Invalid technicalDetails at index ${i}: key and value required`,
          });
        }
      }
    }

    if (additionalInfo && Array.isArray(additionalInfo)) {
      for (let i = 0; i < additionalInfo.length; i++) {
        const info = additionalInfo[i];
        if (!info.key || !info.value) {
          return res.status(400).json({
            success: false,
            message: `Invalid additionalInfo at index ${i}: key and value required`,
          });
        }
      }
    }

    // 🧩 5️⃣ Validate coupons (optional)
    if (coupons && Array.isArray(coupons)) {
      for (let i = 0; i < coupons.length; i++) {
        const coupon = coupons[i];
        if (!coupon.code || typeof coupon.discount === "undefined") {
          return res.status(400).json({
            success: false,
            message: `Invalid coupon at index ${i}: code and discount required`,
          });
        }
        if (isNaN(coupon.discount) || Number(coupon.discount) < 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid discount at coupon[${i}] — must be a positive number`,
          });
        }
      }
    }

    // ✅ 6️⃣ Passed all validations — create product
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update product
const editProduct = async (req, res) => {
  try {
    const {
      title,
      variety,
      itemForm,
      dietType,
      useBy,
      netQuantities,
      coupons,
      images,
      videos,
      labReports,
      aboutItem,
      technicalDetails,
      additionalInfo,
      ingredients,
      legalDisclaimer,
      productDescription,
    } = req.body;

    // 🧩 1️⃣ Check if product exists
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    // 🧩 2️⃣ Validate required fields (if provided)
    const missingFields = [];
    if (title !== undefined && !title) missingFields.push("title");
    if (variety !== undefined && !variety) missingFields.push("variety");
    if (itemForm !== undefined && !itemForm) missingFields.push("itemForm");
    if (dietType !== undefined && !dietType) missingFields.push("dietType");
    if (useBy !== undefined && !useBy) missingFields.push("useBy");
    if (aboutItem !== undefined && !aboutItem) missingFields.push("aboutItem");
    if (productDescription !== undefined && !productDescription)
      missingFields.push("productDescription");
    if (images && (!Array.isArray(images) || images.length === 0))
      missingFields.push("images (at least one required)");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing or invalid fields: ${missingFields.join(", ")}`,
      });
    }

    // 🧩 3️⃣ Validate netQuantities
    if (netQuantities) {
      if (!Array.isArray(netQuantities) || netQuantities.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one net quantity (quantity + price) is required",
        });
      }

      for (let i = 0; i < netQuantities.length; i++) {
        const item = netQuantities[i];
        if (!item.quantity || !item.price) {
          return res.status(400).json({
            success: false,
            message: `Invalid netQuantities at index ${i}: both quantity and price are required`,
          });
        }
        if (isNaN(item.price) || Number(item.price) < 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid price at netQuantities[${i}] — must be a positive number`,
          });
        }
      }
    }

    // 🧩 4️⃣ Validate URLs (images/videos/labReports)
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (images && images.some((url) => !isValidUrl(url))) {
      return res.status(400).json({
        success: false,
        message: "One or more image URLs are invalid",
      });
    }

    if (videos && videos.some((url) => !isValidUrl(url))) {
      return res.status(400).json({
        success: false,
        message: "One or more video URLs are invalid",
      });
    }

    if (labReports && Array.isArray(labReports)) {
      for (let i = 0; i < labReports.length; i++) {
        const report = labReports[i];
        if (!report.title || !report.file) {
          return res.status(400).json({
            success: false,
            message: `Invalid labReport at index ${i}: title and file are required`,
          });
        }
        if (!isValidUrl(report.file)) {
          return res.status(400).json({
            success: false,
            message: `Invalid labReport file URL at index ${i}`,
          });
        }
      }
    }

    if (technicalDetails && Array.isArray(technicalDetails)) {
      for (let i = 0; i < technicalDetails.length; i++) {
        const tech = technicalDetails[i];
        if (!tech.key || !tech.value) {
          return res.status(400).json({
            success: false,
            message: `Invalid technicalDetails at index ${i}: key and value required`,
          });
        }
      }
    }

    if (additionalInfo && Array.isArray(additionalInfo)) {
      for (let i = 0; i < additionalInfo.length; i++) {
        const info = additionalInfo[i];
        if (!info.key || !info.value) {
          return res.status(400).json({
            success: false,
            message: `Invalid additionalInfo at index ${i}: key and value required`,
          });
        }
      }
    }

    // 🧩 5️⃣ Validate coupons
    if (coupons && Array.isArray(coupons)) {
      for (let i = 0; i < coupons.length; i++) {
        const coupon = coupons[i];
        if (!coupon.code || typeof coupon.discount === "undefined") {
          return res.status(400).json({
            success: false,
            message: `Invalid coupon at index ${i}: code and discount required`,
          });
        }
        if (isNaN(coupon.discount) || Number(coupon.discount) < 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid discount at coupon[${i}] — must be a positive number`,
          });
        }
      }
    }

    // ✅ 6️⃣ Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Get all products
 const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product
 const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product
 const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,editProduct
};
