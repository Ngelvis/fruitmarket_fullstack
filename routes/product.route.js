const express = require('express');
const multer = require('multer'); // Ensure multer is installed and required for file uploads
const router = express.Router();
const {
  createProducts,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require('../controller/product.controller.js');

const { verifyJWT } = require('../controller/user.controller.js');

// Setup multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/', verifyJWT, upload.single('image'), createProducts); // Add upload middleware for file uploads
router.get('/', verifyJWT, getProducts);
router.get('/:id', verifyJWT, getProduct);
router.put('/:id', verifyJWT, updateProduct);
router.delete('/:id', verifyJWT, deleteProduct);

module.exports = router;