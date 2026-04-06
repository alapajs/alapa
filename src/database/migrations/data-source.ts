// import {
//   DatabaseConfiguration,
//   DataSource,
//   SnakeNamingStrategy,
//   updateDBConnection,
// } from "alapa";
// import { databaseConnection } from "../src/config/database";
// console.log("Database connection established.");
// require("dotenv").config();
// const entities = ["src/models/**/*.ts"];
// const migration = ["migration/**/*.ts"];
// let dataSource: DataSource = new DataSource({
//   migrations: migration,
//   entities: entities,
//   ...databaseConnection,
//   namingStrategy: new SnakeNamingStrategy(),
// });

// (async function () {
//   const config: DatabaseConfiguration = {
//     logging: process.env.DB_LOGGING === "true",
//     connection: databaseConnection,
//   };
//   dataSource = await updateDBConnection(config);
// })();

// export default dataSource;
