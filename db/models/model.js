const db = require('../connection');

const selectAllTopics = () => {
    const queryString = 'SELECT * FROM topics;';
    return db.query(queryString).then((result) => {
        return result.rows;
    })
};

const selectArticleById = (article_id) => {
    const queryString = `SELECT * FROM articles WHERE article_id=${article_id};`;
    return db.query(queryString).then((result) => {
        return result.rows;
    })
}

module.exports = { selectAllTopics, selectArticleById };