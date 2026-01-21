import express from "express";
import cors from "cors";
import router from "./routes/auth.routes.js";
import routers from "./routes/admin.routes.js";
import srouter from "./routes/store.routes.js";
import rrouter from "./routes/rating.routes.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", router);
app.use("/admin", routers);
app.use("/stores", srouter);
app.use("/stores", rrouter);


// app.get("/test", (req,res) => {
//     res.send("Server is reached!");
// } );


export default app;
