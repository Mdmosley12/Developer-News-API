# **Developer News API**

### https://developer-news.onrender.com

## Setup

You will first need to clone this repository, you can do this by typing `git clone https://github.com/Mdmosley12/NC_News_Project.git` into the bash terminal in VS Code or similar code editor.  
Once the repo is cloned, you will need to create a `.env.development` and a `.env.test file` in order to connect to the respective databases. These files should contain a script to set the database, as shown below.  

### .env.development ###
```
PGDATABASE=nc_news
```
### .env.test ###
```
PGDATABASE=nc_news_test
```

Once these files have been created, run the following terminal commands in order to install the correct dependencies required by this repo.
```
npm init
npm install
```

Next you will need to connect to and seed the databases by running the scripts in the package.json file. To do this, run the following commands in the terminal.
```
npm run setup-dbs
npm run seed
```

## Testing

In the `app.test.js` file, there are numerous tests written that test all functionality of the app, including errors. In order to run these test, simply type the following into the terminal.
```
npm test
```
## Additional Information

It is recommended that you use a node version of 18.8.0 and a Postgres version of 14.6 at a minimum, to ensure that everything works.
