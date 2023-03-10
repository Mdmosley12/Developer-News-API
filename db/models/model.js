const db = require('../connection');
const fs = require('fs/promises');

const selectAllTopics = () => {
    const queryString = 'SELECT * FROM topics;';
    return db.query(queryString).then((result) => {
        return result.rows;
    })
};

const selectAllArticles = (sort_by = 'created_at', order = 'DESC', topic) => {
    const acceptedQuery = ['article_id', 'created_at', 'votes'];
    const acceptedOrder = ['ASC', 'DESC'];
    const queryValues = [];
    let queryString = `SELECT articles.*, COUNT(comments.article_id)
     AS comment_count 
     FROM articles 
     LEFT JOIN comments 
     ON articles.article_id=comments.article_id` 
    if(!acceptedQuery.includes(sort_by)) {
        return Promise.reject({status : 400, msg : 'Bad request!'})
    }
    if(!acceptedOrder.includes(order)) {
        return Promise.reject({status : 400, msg : 'Bad request!'})
    }
    if (topic !== undefined) {
        queryString += ` WHERE articles.topic = $1`
        queryValues.push(topic)
    }
    queryString += ` GROUP BY articles.article_id`;
    queryString += ` ORDER BY ${sort_by} ${order};`;
    return db.query(queryString, queryValues).then((result) => {
        if(result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Not Found'})
        } else {
            return result.rows;
        }
    })
};

const selectArticleById = (article_id) => {
    const queryValues = [article_id];
    const queryString = `SELECT articles.*, COUNT(comments.article_id)
     AS comment_count
     FROM articles
     LEFT JOIN comments
     ON articles.article_id=comments.article_id
     WHERE articles.article_id = $1
     GROUP BY articles.article_id
     ORDER BY created_at DESC;`;
    return db.query(queryString, queryValues).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Requested article not found!'})
        } else {
            return {article : result.rows};
        }
    })
};

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

const removeComment = (comment_id) => {
    const queryString = `DELETE FROM comments WHERE comment_id = $1;`;
    return db.query(queryString, [comment_id])
    .then((result) => {
        if(result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: 'Not Found!'});
        }
    })
};

const selectAllEndpoints = () => {
    return fs.readFile('./endpoints.json', 'utf-8', (err, data) => {
        if (err) throw (err);
    })
};

module.exports = { selectAllTopics, selectAllArticles, selectArticleById, selectCommentsByArticleId, addComment, updateArticle, selectAllUsers, removeComment, selectAllEndpoints };