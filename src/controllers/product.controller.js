'use strict';

const { CREATED } = require('../core/success.resoponse');
const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.xxx');

class ProductController {

    createProduct = async (req, res, next) => {
        // new CREATED({
        //     message: 'Product created successfully',
        //     metadata: await ProductService.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId
        //     })
        // }).send(res);

        new CREATED({
            message: 'Product created successfully',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res);
    }

}

module.exports = new ProductController();
