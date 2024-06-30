const pModel = require('../models/productModel.js');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (replace with your actual credentials)
cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});

// helps to create a product
const createProducts = async (req, res) => {
  try {
    // Check for required fields
    if (!req.body.productName || !req.body.productQuantity || !req.body.productPrice) {
      return res.status(400).send({
        message: 'All fields must be filled, please check again'
      });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).send({
        message: 'Product image must be uploaded'
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Get user ID from the response object
    const userId = res.user?.id;

    // Prepare product data
    const productData = { ...req.body, createdBy: userId, imageUrl: result.url };

    // Create product in the database
    const userProductDetails = await pModel.create(productData);

    // Send response
    res.status(201).json(userProductDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// helps to get all the products
const getProducts = async (req, res) => {
  try {
    // Get user ID from the response object
    const userId = res.user?.id;
    
    // Check if user is authorized
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User! Please Login" });
    }

    // Query to find products created by the user
    const query = { createdBy: userId };

    // Fetch products from the database
    const products = await pModel.find(query);
    
    // Send response
    res.status(200).json({
      count: products.length,
      data: products,
      message: 'Products fetched successfully'
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// helps to get a singular product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch product by ID from the database
    const product = await pModel.findById(id);
    
    // Check if product exists
    if (!product) {
      return res.status(404).json({
        message: 'Product not found!'
      });
    }
    
    // Send response
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// helps to edit or update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Update product by ID
    const productIdentity = await pModel.findByIdAndUpdate(id, req.body, { new: true });

    // Check if product exists
    if (!productIdentity) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    // Send response
    res.status(200).json({ message: 'Product Updated Successfully!', product: productIdentity });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// helps to delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete product by ID
    const productIdentity = await pModel.findByIdAndDelete(id);

    // Check if product exists
    if (!productIdentity) {
      return res.status(404).json({
        message: 'Unable to Delete, Product not found'
      });
    }

    // Send response
    res.status(200).json({
      message: 'Product Deleted Successfully!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProducts,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};