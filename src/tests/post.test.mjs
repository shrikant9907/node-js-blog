import request from 'supertest';
import { expect } from 'chai';
import app from '../../app.mjs';

describe('Post API', function () {
    let postId = '';
    const postData = {
        title: `Test Post ${Date.now()}`,
        content: 'This is the content of the test post.',
        author: 'Test Author',
    };

    // Test GET /posts
    it('GET /posts should return status 200 and list posts', async function () {
        const res = await request(app).get('/api/posts');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('posts');
        expect(res.body.posts).to.be.an('array');
    });

    // Test POST /posts (create post)
    it('POST /posts should create a new post', async function () {
        const res = await request(app)
            .post('/api/posts')
            .send(postData);

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('newPost');
        postId = res.body.newPost._id; // Save the ID of the created post
    });

    // Test GET /posts/:id (retrieve a single post by ID)
    it('GET /posts/:id should return the post with the given ID', async function () {
        const res = await request(app).get(`/api/posts/${postId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('post');
        expect(res.body.post._id).to.equal(postId);
    });

    // Test PATCH /posts/:id (update a post)
    it('PATCH /posts/:id should update the post with new data', async function () {
        const updatedData = { title: 'Updated Post Title' };
        const res = await request(app)
            .patch(`/api/posts/${postId}`)
            .send(updatedData);

        expect(res.status).to.equal(200);
        expect(res.body.updatedPost.title).to.equal(updatedData.title);
    });

    // Test PATCH /posts/:id with invalid post ID
    it('PATCH /posts/:id should return 404 if the post does not exist', async function () {
        const invalidPostId = 'nonexistentpostid';
        const updatedData = { title: 'Updated Post Title' };

        const res = await request(app)
            .patch(`/api/posts/${invalidPostId}`)
            .send(updatedData);

        expect(res.status).to.equal(404); // Post not found
    });

    // Test DELETE /posts/:id (delete a post)
    it('DELETE /posts/:id should delete the post with the given ID', async function () {
        const res = await request(app).delete(`/api/posts/${postId}`);
        expect(res.status).to.equal(200);
    });

    // Test DELETE /posts/:id with invalid post ID
    it('DELETE /posts/:id should return 404 if the post does not exist', async function () {
        const invalidPostId = 'nonexistentpostid';

        const res = await request(app).delete(`/api/posts/${invalidPostId}`);
        expect(res.status).to.equal(404); // Post not found
    });
});
