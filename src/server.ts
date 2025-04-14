import "newrelic";

import dotenv from "dotenv";
import { app } from "./app";
import logger from "./util/logger";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running at port: ${PORT}`);
});
