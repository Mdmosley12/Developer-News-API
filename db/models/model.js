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
const selectArticleById = (article_id) => {
    const queryValues = [article_id];
    const queryString = `SELECT * FROM articles WHERE article_id = $1;`;
    return db.query(queryString, queryValues).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Requested article not found!'})
        } else {
            return {article : result.rows};
        }
    })
}

const selectCommentsByArticleId = (article_id) => {
    const queryValues = [article_id];
    const queryString = `SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`;
    return db.query(queryString, queryValues).then((result) => {
        if(result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Requested article not found!'});
        } else {
            return result.rows;
        }
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
};

const updateArticle = (article_id, updateValues) => {
    const { inc_votes } = updateValues;
    const sqlQuery = `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`;
    return db.query(sqlQuery, [
        inc_votes,
        article_id
    ])
    .then(({ rows }) => {
        return rows[0];
    })
};

const selectAllUsers = () => {
    const queryString = `SELECT * FROM users;`;
    return db.query(queryString)
    .then((result) => {
        return result.rows;
    })
};

module.exports = { selectAllTopics, selectAllArticles, selectArticleById, selectCommentsByArticleId, addComment, updateArticle, selectAllUsers };