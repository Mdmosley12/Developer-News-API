const app = require('../db/app/app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const { get } = require('../db/app/app');

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    return db.end();
});

describe('app testing', () => {
    describe('error handling', () => {
        test('Returns a 404 status and an error message when the entered route does not exist', () => {
            return request(app)
            .get('/notAPath')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid input!');
            })
        })
        test('Returns a 400 status code and an error message when the requested article does not exist', () => {
            return request(app)
            .get('/api/articles/999/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Requested article not found!');
            })
        })
        test('Returns a 404 status code and an error message when an invalid ID has beenn entered', () => {
            return request(app)
            .get('/api/articles/ten/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid data type in request!');
            })
        })
        test('Returns a 404 status code and an error message when an invalid or empty username is passed in the post request', () => {
            const newComment = {
                username: "MDMosley12",
                body: 'I love coding!'
            }
            return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('No username found!')
            })
        })
        test('Returns a 400 status and an error message when the desiredUpdates value is the wrong data type in a patch request', () => {
            const desiredUpdates = {inc_votes : 'one'};
            return request(app)
            .patch('/api/articles/1')
            .send(desiredUpdates)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid data type in request!');
            })
        })
    })
    describe('get topics', () => {
        test('Returns a 200 status and all topics', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: {topics} }) => {
                expect(topics.length).toBeGreaterThan(0);
                topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    )
                })
            })
        })
    })
    describe('get articles', () => {
        test('Returns a 200 status and all articles', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: {articles} }) => {
                expect(articles.length).toBeGreaterThan(0);
                articles.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            article_img_url: expect.any(String)
                        })
                    )
                })
            })
        })
        test('200: sorts by date in descending order by default', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: {articles}}) => {
                expect(articles).toBeSortedBy('created_at', {descending: true})
                expect(articles[0].article_id).toBe(3);
                expect(articles[articles.length - 1].article_id).toBe(7)
            })
        })
        test('200: contains a comment_count property which counts all the comments with a certain article_id', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: {articles} }) => {
                expect(articles[0].comment_count).toBe('2');
                articles.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            comment_count: expect.any(String)
                        })
                    )
                })
            })
        })
    })
    describe('get article by id', () => {
        test('Returns the requested article', () => {
            return request(app)
            .get('/api/articles/2')
            .expect(200)
            .then(({ body: {article} }) => {
                expect(article.article[0].article_id).toBe(2)
                expect(article.article[0]).toEqual(
                    expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String)
                    })
                )
            })
        })
        test('200: contains a comment_count property which displays a count of all the comments for the requested article', () => {
            return request(app)
            .get('/api/articles/6')
            .expect(200)
            .then(({ body: {article} }) => {
                expect(article.article[0].comment_count).toBe('1');
                article.article.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            comment_count: expect.any(String)
                        })
                    )
                })
            })
        })
    })
    describe('get comments by article_id', () => {
        test('200: Returns all comments related to the requested article_id', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body: {comments} }) => {
                expect(comments.length).toBe(11);
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            body: expect.any(String),
                            article_id: expect.any(Number),
                            author: expect.any(String),
                            votes: expect.any(Number),
                            created_at: expect.any(String)
                        })
                    )
                })
            })
        })
        test('200: All returned comments are sorted by date in descending order', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body: {comments} }) => {
                expect(comments).toBeSortedBy('created_at', {descending: true})
                expect(comments[0].comment_id).toBe(5);
                expect(comments[10].comment_id).toBe(9);
            })
        })
    })
    describe('post comments', () => {
        test('201: The new comment is added to the database', () => {
            const newComment = {
                username: "butter_bridge",
                body: 'I love coding!'
            };
            return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                return request(app)
                .get('/api/articles/3/comments')
                .expect(200)
                .then(({ body : {comments} }) => {
                    expect(comments.length).toBe(3)
                    expect(comments[0].body).toBe(newComment.body)
                })
            })
        })
        test('201: Responds with the added comment', () => {
            const newComment = {
                username: "butter_bridge",
                body: 'I love coding!'
            }
            return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toEqual(
                    expect.objectContaining({
                        article_id: 3,
                        votes: 0,
                        author: "butter_bridge",
                        body: 'I love coding!',
                        created_at: expect.any(String)
                    })
                )
            })
        })
    })
    describe('patch article', () => {
        test('Returns the requested article with the votes key increased by the amount stated in the patch request', () => {
            const desiredUpdates = {inc_votes : 1};
            return request(app)
            .patch('/api/articles/1')
            .send(desiredUpdates)
            .expect(200)
            .then(({ body: {updatedArticle} }) => {
                expect(updatedArticle.votes).toBe(101)
            })
        })
        test('Returns the requested article with the votes key decreased by the amount stated in the patch request', () => {
            const desiredUpdates = {inc_votes : -1};
            return request(app)
            .patch('/api/articles/1')
            .send(desiredUpdates)
            .expect(200)
            .then(({ body: {updatedArticle} }) => {
                expect(updatedArticle.votes).toBe(99)
            })
        })
        test('The changes have been commited to the database', () => {
            const desiredUpdates = {inc_votes : 1};
            return request(app)
            .patch('/api/articles/1')
            .send(desiredUpdates)
            .expect(200)
            .then(() => {
                return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({ body: {article} }) => {
                    expect(article.article[0].votes).toBe(101);
                })
            })
        })
    })
    describe('get users', () => {
        test('200: Returns all users', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body: {users} }) => {
                expect(users.length).toBeGreaterThan(0);
                users.forEach((user) => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        })
                    )
                })
            })
        })
    })
})