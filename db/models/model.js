const db = require('../connection');

const selectAllTopics = () => {
    const queryString = 'SELECT * FROM topics;';
    return db.query(queryString).then((result) => {
        return result.rows;
    })
};

const selectAllArticles = () => {
    const queryString = `SELECT articles.*, COUNT(comments.article_id)
     AS comment_count 
     FROM articles 
     LEFT JOIN comments 
     ON articles.article_id=comments.article_id 
     GROUP BY articles.article_id 
     ORDER BY created_at DESC;`;
    return db.query(queryString).then((result) => {
        return result.rows;
    })
};

const selectCommentsByArticleId = (article_id) => {
    const queryValues = [article_id];
    const queryString = `SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`;
    return db.query(queryString, queryValues).then((result) => {
        return result.rows;
    })
}

module.exports = { selectAllTopics, selectAllArticles, selectCommentsByArticleId };