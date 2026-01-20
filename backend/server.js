import app from "./src/app.js";
import { config } from "./src/config/env.js";


const PORT = process.env.PORT || 5000;

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
})