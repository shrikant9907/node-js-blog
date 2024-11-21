import request from 'supertest';
import { expect } from 'chai';
import app from '../../app.mjs';

describe('Tag API', function () {
    let tagId = '';
    const tagName = 'Test Tag for Dynamic Handling';

    // Test GET /tags
    it('GET /tags should return status 200 and list tags', function (done) {
        request(app)
            .get('/api/tags')
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('tags');
                expect(res.body.tags).to.be.an('array');
                done();
            });
    });

    // Test POST /tags (create if not exists)
    it('POST /tags should create a new tag if it does not exist', function (done) {
        request(app)
            .get(`/api/tags`)
            .end((err, res) => {
                const existingTag = res.body.tags.find(tag => tag.name === tagName);

                if (existingTag) {
                    tagId = existingTag._id;
                    done();
                } else {
                    const newTag = {
                        name: tagName,
                    };

                    request(app)
                        .post('/api/tags')
                        .send(newTag)
                        .end((err, res) => {
                            expect(res.status).to.equal(201);
                            expect(res.body).to.have.property('newTag');
                            tagId = res.body.newTag._id;
                            done();
                        });
                }
            });
    });

    // Test PATCH /tags/:id (update tag)
    it('PATCH /tags/:id should update an existing tag', function (done) {
        const updatedData = { name: 'Updated Tag Name' };

        request(app)
            .patch(`/api/tags/${tagId}`)
            .send(updatedData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.updatedTag.name).to.equal(updatedData.name);
                done();
            });
    });

    // Test PATCH /tags/:id with invalid tag ID
    it('PATCH /tags/:id should return 404 if the tag does not exist', function (done) {
        const invalidTagId = 'nonexistenttagid';
        const updatedData = { name: 'Updated Tag Name' };

        request(app)
            .patch(`/api/tags/${invalidTagId}`)
            .send(updatedData)
            .end((err, res) => {
                expect(res.status).to.equal(404); // Tag not found
                done();
            });
    });

    // Test DELETE /tags/:id (delete tag)
    it('DELETE /tags/:id should delete an existing tag', function (done) {
        request(app)
            .delete(`/api/tags/${tagId}`)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    // Test DELETE /tags/:id with invalid tag ID
    it('DELETE /tags/:id should return 404 if the tag does not exist', function (done) {
        const invalidTagId = 'nonexistenttagid';

        request(app)
            .delete(`/api/tags/${invalidTagId}`)
            .end((err, res) => {
                expect(res.status).to.equal(404); // Tag not found
                done();
            });
    });
});
