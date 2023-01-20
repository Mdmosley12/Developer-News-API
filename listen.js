const app = require('./db/app/app');
const PORT = process.env.PORT || 9090;

app.listen(PORT, () => console.log(`Listening on ${PORT}`))