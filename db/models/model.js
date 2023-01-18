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

const addComment = (article_id, newComment) => {
    const sqlQuery = `INSERT INTO comments (author, body, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;`;
    return db.query(sqlQuery, [
        newComment.username,
        newComment.body,
        article_id
    ])
    .then(({ rows }) => {
        return rows[0];
    })
}
module.exports = { selectAllTopics, selectAllArticles, addComment };