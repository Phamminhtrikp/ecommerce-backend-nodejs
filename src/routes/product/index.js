'use strict';

const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

// Authentication //
router.use(authenticationV2);
///////////
router.post('', asyncHandler(ProductController.createProduct));

module.exports = router;