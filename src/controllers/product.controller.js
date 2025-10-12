'use strict';

const { CREATED, OK, SuccessResponse } = require('../core/success.resoponse');
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

    // Update product
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Product updated successfully',
            metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId,
            })
        }).send(res);
    }

    /**
     * Publish a product by shop
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    publishProductByShop = async (req, res, next) => {
        new OK({
            message: 'Product published successfully',
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    /**
     * Unpublish a product by shop
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    unPublishProductByShop = async (req, res, next) => {
        new OK({
            message: 'Product unpublished successfully',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    /**
     * Get all draft products for a specific shop
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns {JSON} List of draft products
     */
    getAllDraftsForShop = async (req, res, next) => {
        new OK({
            message: 'Get all drafts successfully',
            metadata: await ProductServiceV2.findAllDraftsForShop(req.user.userId)
        }).send(res);
    }

    /**
     * Get all published products for a specific shop
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns {JSON} List of published products
     */
    getAllPublishedForShop = async (req, res, next) => {
        new OK({
            message: 'Get all published successfully',
            metadata: await ProductServiceV2.findAllPublishedForShop(req.user.userId)
        }).send(res);
    }

    /**
     * Get list search products
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getListSearchProducts = async (req, res, next) => {
        new OK({
            message: 'Get list search products successfully',
            metadata: await ProductServiceV2.getListSearchProducts({ keySearch: req.params.keySearch })
        }).send(res);
    }

    findAllProducts = async (req, res, next) => {
        new OK({
            message: 'Get all products successfully',
            metadata: await ProductServiceV2.findAllProducts({ ...req.query })
        }).send(res);
    }

    findProduct = async (req, res, next) => {
        new OK({
            message: 'Get product successfully',
            metadata: await ProductServiceV2.findProduct({ product_id: req.params.product_id })
        }).send(res);
    }

}

module.exports = new ProductController();
