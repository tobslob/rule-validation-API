import "module-alias/register";
import "reflect-metadata";
import http from "http";
import { App } from "./server/app";
import dotenv from "dotenv";
import { Log } from "@app/common/services/log";

dotenv.config();

const start = async () => {
  try {
    const app = new App();
    const appServer = app.getServer().build();
    // start server
    const httpServer = http.createServer(appServer);
    httpServer.listen(process.env.PORT);
    httpServer.on("listening", () => Log.info(`🚀  ${process.env.service_name} listening on ` + process.env.PORT));
  } catch (err) {
    Log.error(err, "Fatal server error");
  }
};

start();
