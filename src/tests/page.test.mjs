import request from 'supertest';
import { expect } from 'chai';
import app from '../../app.mjs'; // Your app or server path

describe('Page API', function () {
    let pageId = ''; // Variable to store page ID for further tests
    const timestamp = Date.now(); // Using timestamp to ensure uniqueness of the title
    const pageData = {
        title: `Test Page`, // Unique title
        content: 'This is the content of the test page.',
        metaDescription: 'Meta description for the test page.',
    };

    // Test 1: POST /api/pages (Create Page)
    it('POST /api/pages should create a new page with unique title', async function () {
        const res = await request(app)
            .post('/api/pages')
            .send(pageData);

        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal('Page created successfully');
        expect(res.body).to.have.property('newPage');
        pageId = res.body.newPage._id;  // Save the ID for future tests
    });

    // Test 2: GET /api/pages/:id (Get page by ID)
    it('GET /api/pages/:id should return the correct page by ID', async function () {
        const res = await request(app)
            .get(`/api/pages/${pageId}`);

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Page retrieved successfully');
        expect(res.body.page).to.have.property('_id', pageId);
    });

    // Test 3: PUT /api/pages/:id (Update page)
    it('PUT /api/pages/:id should update page data', async function () {
        const updatedData = {
            title: 'Updated Page Title',
            content: 'Updated content for the page.',
            metaDescription: 'Updated meta description.',
        };

        const res = await request(app)
            .put(`/api/pages/${pageId}`)
            .send(updatedData);

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Page updated successfully');
        expect(res.body.updatedPage).to.have.property('title', updatedData.title);
    });

    // Test 4: DELETE /api/pages/:id (Delete page)
    it('DELETE /api/pages/:id should delete the page successfully', async function () {
        const res = await request(app)
            .delete(`/api/pages/${pageId}`);

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Page deleted successfully');
    });

    // Test 5: POST /api/pages (Create Page) Missing Fields
    it('POST /api/pages should return 400 when title is missing', async function () {
        const invalidData = {
            content: 'Content without title',
        };

        const res = await request(app)
            .post('/api/pages')
            .send(invalidData);

        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('Title and content are required');
    });

    // Test 6: PUT /api/pages/:id (Invalid page ID)
    it('PUT /api/pages/:id should return 404 for non-existent page', async function () {
        const updatedData = {
            title: 'Updated Page Title',
            content: 'Updated content for the page.',
            metaDescription: 'Updated meta description.',
        };

        const res = await request(app)
            .put('/api/pages/1111111111111111111')
            .send(updatedData);

        expect(res.status).to.equal(404);
    });
});
