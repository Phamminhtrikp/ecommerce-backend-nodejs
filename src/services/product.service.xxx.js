'use strict';

const { product, clothing, electronics, furniture } = require('../models/product.model');
const { BadRequestError } = require('../core/error.resoponse');
const {
    publishProductByShop,
    unPublishProductByShop,
    findAllDraftsForShop,
    findAllPublishedForShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
} = require('../models/repositories/product.repo');
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils');

// Define Factory class to create product
class ProductFactory {
    /***
     * type: 'Clothing' | 'Electronics', etc.
     * payload: product data
     */

    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) {
            throw new BadRequestError('Invalid product type');
        }
        return new productClass(payload).createProduct();
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) {
            throw new BadRequestError('Invalid product type');
        }
        return new productClass(payload).updateProduct(productId);
    }

    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id });
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id });
    }

    static async findAllDraftsForShop(product_shop, limit = 50, skip = 0) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftsForShop({ query, limit, skip });
    }

    static async findAllPublishedForShop(product_shop, limit = 50, skip = 0) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishedForShop({ query, limit, skip });
    }

    static async getListSearchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch });
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({
            limit,
            sort,
            page,
            filter,
            select: ['product_name', 'product_thumb', 'product_price']
        });
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] });
    }
}

// Define base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    // Create new product
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id });
    }

    // Update existing product
    async updateProduct(productId, payload) {
        return await updateProductById({ productId, payload, model: product });
    }

}

// Define sub-class for different product types Clothing
class Clothing extends Product {

    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes);
        if (!newClothing) throw new BadRequestError('Create new clothing failed');

        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError('Create new product failed');

        return newProduct;
    }

    async updateProduct(productId) {
        /**
         * Remove attr has null or undefined value
         * Check where the update is?
         */

        const objectParams = removeUndefinedObject(this);
        if (objectParams.product_attributes) {
            // Update child
            await updateProductById({
                productId,
                payload: updateNestedObjectParser(objectParams.product_attributes),
                model: clothing
            });
        }

        const updatedProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));

        return updatedProduct;
    }
}

// Define sub-class for different product types Electronics
class Electronics extends Product {

    async createProduct() {
        const newElectronics = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newElectronics) throw new BadRequestError('Create new electronics failed');

        const newProduct = await super.createProduct(newElectronics._id);
        if (!newProduct) throw new BadRequestError('Create new product failed');

        return newProduct;
    }

    async updateProduct(productId) {
        /**
         * Remove attr has null or undefined value
         * Check where the update is?
         */

        const objectParams = removeUndefinedObject(this);
        if (objectParams.product_attributes) {
            // Update child
            await updateProductById({
                productId,
                payload: updateNestedObjectParser(objectParams.product_attributes),
                model: clothing
            });
        }

        const updatedProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));

        return updatedProduct;
    }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {

    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if (!newFurniture) throw new BadRequestError('Create new furniture failed');

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError('Create new product failed');

        return newProduct;
    }

    async updateProduct(productId) {
        /**
         * Remove attr has null or undefined value
         * Check where the update is?
         */

        const objectParams = removeUndefinedObject(this);
        if (objectParams.product_attributes) {
            // Update child
            await updateProductById({
                productId,
                payload: updateNestedObjectParser(objectParams.product_attributes),
                model: clothing
            });
        }

        const updatedProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));

        return updatedProduct;
    }
}

// Register product types
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;