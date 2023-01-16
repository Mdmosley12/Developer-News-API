You will not be able to run this code without the appropriate .env files.

In order to run this code, create two files in the root called .env.development & .env.test.

In the .env.development file, PASTE PGDATABASE=nc_news

In the .env.test file, PASTE PGDATABASE=nc_news_test

You will also need to run an npm install in the terminal at this point.

You should now be able to use 'npm run' to run the setup-dbs, seed & test scripts listed in the package.json file.