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
        test('Returns a 400 status and an error message when an invalid ID has been entered', () => {
            return request(app)
            .get('/api/articles/two')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid article request!');
            })
        })
        test('Returns a 404 status and an error message when the requested article does not exist', () => {
            return request(app)
            .get('/api/articles/99999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Requested article not found!');
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
    })
})