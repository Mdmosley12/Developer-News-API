const db = require('../connection');

const selectAllTopics = () => {
    const queryString = 'SELECT * FROM topics;';
    return db.query(queryString).then((result) => {
        return result.rows;
    })
};

const selectAllArticles = () => {
    const queryString = `SELECT * FROM articles ORDER BY created_at DESC;`;
    return db.query(queryString).then((result) => {
        console.log(result.rows);
        return result.rows;
    })
};

module.exports = { selectAllTopics, selectAllArticles };