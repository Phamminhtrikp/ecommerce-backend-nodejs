'use strict';

const { CREATED } = require('../core/success.resoponse');
const ProductService = require('../services/product.service');

class ProductController {

    createProduct = async (req, res, next) => {
        new CREATED({
            message: 'Product created successfully',
            metadata: await ProductService.createProduct(req.body.product_type, req.body)
        }).send(res);
    }

}

module.exports = new ProductController();
