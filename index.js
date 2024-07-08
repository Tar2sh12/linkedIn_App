import express from 'express';
import { config } from "dotenv";

// import noteRouter from "./src/modules/Note/note.routes.js";
import { db_connection } from "./DB/connection.js";
import companyRouter from './src/modules/Company/company.routes.js'
import userRouter from './src/modules/User/user.routes.js';
import jobRouter from './src/modules/Job/job.routes.js'
import { globaleResponse } from './src/middleware/error-handling.middleware.js';



const app = express();

// // check the environment if it is dev or prod
// if (process.env.NODE_ENV == "dev") {
//   config({ path: path.resolve(".dev.env") });
// }
// if (process.env.NODE_ENV == "prod") {
//   config({ path: path.resolve(".prod.env") });
// }
config();

const port = process.env.PORT;

app.use(express.json());

app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/job", jobRouter);
app.use(globaleResponse);

db_connection();

// app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
