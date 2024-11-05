const {default : productDAO} = await import ('../dao/ProductDAO.js');

class ProductRepository {
    async findAll() {
        return await productDAO.getAllProducts();
    }
    
    async findByOrderAndPagination(queryObj, sortObj, page, limit) {
        return await productDAO.getOrderAndPageProducts(queryObj, sortObj, page, limit);
    }

    async findById(productId) {
        return await productDAO.getProductById(productId);
    }

    async save(productData) {
        return await productDAO.createProduct(productData);
    }

    async update(productId, productData) {
        return await productDAO.updateProductById(productId, productData);
    }

    async deleteById(productId) {
        return await productDAO.deleteProductById(productId);
    }
}

const productRepository = new ProductRepository();
export default productRepository;