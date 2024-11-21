import request from 'supertest';
import { expect } from 'chai';
import app from '../../app.mjs';

describe('Category API', function () {
    let categoryId = '';
    const categoryName = 'Test Category for Dynamic Handling';

    // Test GET /categories
    it('GET /categories should return status 200 and list categories', function (done) {
        request(app)
            .get('/api/categories')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('categories');
                expect(res.body.categories).to.be.an('array');
                done();
            });
    });

    // Test POST /categories (create if not exists)
    it('POST /categories should create a new category if it does not exist', function (done) {
        request(app)
            .get(`/api/categories`)
            .end((err, res) => {
                const existingCategory = res.body.categories.find(category => category.name === categoryName);

                if (existingCategory) {
                    categoryId = existingCategory._id;
                    done();
                } else {
                    const newCategory = {
                        name: categoryName,
                        description: 'A description for the new category',
                    };

                    request(app)
                        .post('/api/categories')
                        .send(newCategory)
                        .end((err, res) => {
                            expect(res.status).to.equal(201);
                            expect(res.body).to.have.property('newCategory');
                            categoryId = res.body.newCategory._id;
                            done();
                        });
                }
            });
    });


    // Test PATCH /categories/:id (update category)
    it('PATCH /categories/:id should update an existing category', function (done) {
        const updatedData = { name: 'Updated Category Name' };

        request(app)
            .patch(`/api/categories/${categoryId}`)
            .send(updatedData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.updatedCategory.name).to.equal(updatedData.name);
                done();
            });
    });

    // Test PATCH /categories/:id with invalid category ID
    it('PATCH /categories/:id should return 404 if the category does not exist', function (done) {
        const invalidCategoryId = 'nonexistentcategoryid';
        const updatedData = { name: 'Updated Category Name' };

        request(app)
            .patch(`/api/categories/${invalidCategoryId}`)
            .send(updatedData)
            .end((err, res) => {
                expect(res.status).to.equal(404); // Category not found
                done();
            });
    });

    // Test DELETE /categories/:id (delete category)
    it('DELETE /categories/:id should delete an existing category', function (done) {
        request(app)
            .delete(`/api/categories/${categoryId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    // Test DELETE /categories/:id with invalid category ID
    it('DELETE /categories/:id should return 404 if the category does not exist', function (done) {
        const invalidCategoryId = 'nonexistentcategoryid';

        request(app)
            .delete(`/api/categories/${invalidCategoryId}`)
            .end((err, res) => {
                expect(res.status).to.equal(404); // Category not found
                done();
            });
    });


});
