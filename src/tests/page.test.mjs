import request from 'supertest';
import { expect } from 'chai';
import app from '../../app.mjs';

describe('Page API', function () {
    let pageId = '';
    const pageData = {
        title: 'Test Page for Dynamic Handling',
        content: 'This is the content of the test page.',
        metaDescription: 'Meta description for the test page.',
    };

    // Test GET /api/pages
    it('GET /api/pages should return status 200 and list all pages', function (done) {
        request(app)
            .get('/api/pages')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.success).to.be.true;
                expect(res.body.data).to.be.an('array');
                done();
            });
    });

    // Test POST /api/pages
    it('POST /api/pages should create a new page successfully', function (done) {
        request(app)
            .post('/api/pages')
            .send(pageData)
            .end((err, res) => {
                expect(res.status).to.equal(201);
                expect(res.body.success).to.be.true;
                expect(res.body.data).to.have.property('title', pageData.title);
                pageId = res.body.data._id;  // Save the ID for further tests
                done();
            });
    });

    // Test GET /api/pages/:id (valid ID)
    it('GET /api/pages/:id should return the page details for the given ID', function (done) {
        request(app)
            .get(`/api/pages/${pageId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.success).to.be.true;
                expect(res.body.data).to.have.property('_id', pageId);
                done();
            });
    });

    // Test GET /api/pages/:id (invalid ID)
    it('GET /api/pages/:id should return 404 for non-existent page', function (done) {
        // Use an invalid page ID (non-existent page)
        request(app)
            .get('/api/pages/invalidPageId')  // Replace 'invalidPageId' with a non-existent ID
            .end((err, res) => {
                expect(res.status).to.equal(404);  // Expecting a 404 response
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.equal('Page not found');  // The message should indicate the page was not found
                done();
            });
    });

    // Test PUT /api/pages/:id (valid ID)
    it('PUT /api/pages/:id should update the page details', function (done) {
        const updatedData = {
            title: 'Updated Test Page Title',
            content: 'Updated content for the page.',
            metaDescription: 'Updated meta description.',
        };

        request(app)
            .put(`/api/pages/${pageId}`)
            .send(updatedData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.success).to.be.true;
                expect(res.body.data).to.have.property('title', updatedData.title);
                done();
            });
    });

    // Test PUT /api/pages/:id (invalid ID)
    it('PUT /api/pages/:id should return 404 for non-existent page', function (done) {
        const updatedData = {
            title: 'Updated Test Page Title',
            content: 'Updated content for the page.',
            metaDescription: 'Updated meta description.',
        };

        request(app)
            .put('/api/pages/invalidPageId')
            .send(updatedData)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.equal('Page not found');
                done();
            });
    });

    // Test DELETE /api/pages/:id (valid ID)
    it('DELETE /api/pages/:id should delete the page successfully', function (done) {
        request(app)
            .delete(`/api/pages/${pageId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.success).to.be.true;
                expect(res.body.message).to.equal('Page deleted successfully');
                done();
            });
    });

    // Test DELETE /api/pages/:id (invalid ID)
    it('DELETE /api/pages/:id should return 404 for non-existent page', function (done) {
        request(app)
            .delete('/api/pages/invalidPageId')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body.success).to.be.false;
                expect(res.body.message).to.equal('Page not found');
                done();
            });
    });
});
