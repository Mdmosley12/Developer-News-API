const app = require('../db/app/app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

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
    })
    describe('get topics', () => {
        test('Returns a 200 status and all topics', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                expect(body.length).toBeGreaterThan(0);
                body.forEach((topic) => {
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
                expect(articles[0].article_id).toBe(3);
                expect(articles[articles.length - 1].article_id).toBe(7)
            })
        })
        test.only('200: contains a comment_count property which counts all the comments with a certain article_id', () => {
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
})