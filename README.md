# fullstack
fe and be

# init back end and db
npm init -y
npm i express pg sequelize jsonwebtoken bcrypt dotenv
npm i nodemon sequelize-cli --save-dev
code app.js .env .gitignore
mkdir routes, controllers

# start
npx sequelize init

# create data table
npx sequelize-cli model:generate --name User --attributes email:string,password:string,username:string,image:string

npx sequelize-cli model:generate --name Item --attributes name:string,category:string,price:integer,stock:integer,image:string,UserId:integer,TypeId:integer,BrandId:integer

npx sequelize-cli model:generate --name Type --attributes name:string

npx sequelize-cli model:generate --name Profile --attributes fullname:string,role:string,address:string

npx sequelize-cli model:generate --name Brand --attributes name:string,city:string,region:string,country:string

# migrate table
create di package.json:
    "createDB": "npx sequelize-cli db:create",
    "migrateDB": "npx sequelize-cli db:migrate",
    "DB": "npm run createDB && npm run migrateDB",

npm run DB

undo migration:
npx sequelize-cli db:migare:undo:all

# defining the sequelize associations / relation / check ke documentation
https://sequelize.org/docs/v6/core-concepts/assocs/

