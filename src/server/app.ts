import "module-alias/register";
import "reflect-metadata";
import bodyparser from "body-parser";
import { getRouteInfo, InversifyExpressServer } from "inversify-express-utils";
import container from "@app/common/config/ioc";
import { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import {
  welcomeMessage,
  details,
  jSendError,
  jSendSuccess,
  notFoundError,
  internalServerError
} from "@app/data/utilities/util";

dotenv.config();

export class App {
  private server: InversifyExpressServer;
  constructor() {
    this.server = new InversifyExpressServer(container, null, {
      rootPath: process.env.api_version
    });

    // setup server-level middlewares
    this.server.setConfig((app: Application) => {
      app.enabled("x-powered-by");

      app.use(bodyparser.urlencoded({ extended: true }));
      app.use(bodyparser.json());
    });

    this.server.setErrorConfig((app: Application) => {
      // expose index endpoint
      app.get("/", (req: Request, res: Response) => {
        jSendSuccess(req, res, welcomeMessage, details);
      });

      // register 404 route handler
      app.use((_req, res, _next) => {
        jSendError(res, notFoundError, 404, null);
      });

      // handle all error
      app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
        if (err) {
          jSendError(res, internalServerError, 404, err.message);
        }
        return next();
      });
    });
  }

  printRoutes() {
    const routeInfo = getRouteInfo(container);
    console.log(JSON.stringify(routeInfo));
  }

  getServer = () => this.server;
}
