import { Request, Response } from "express";
import { injectable, unmanaged } from "inversify";
import Logger = require("bunyan");
import { Log } from "../../common/services/log";

@injectable()
export class Controller<T> {
  constructor(@unmanaged() private logger: Logger) {}

  /**
   * Handles operation success and sends a HTTP response.
   * __Note__: if the data passed is a promise, no value is sent
   * until the promise resolves.
   * @param req Express request
   * @param res Express response
   * @param result Success data
   */
  async jSendSuccess(req: Request, res: Response, msg: string, result: T) {
    res.json({
      message: msg,
      status: "success",
      data: result
    });
    this.logger.info({ req, res });
  }
}

export class BaseController<T> extends Controller<T> {
  constructor() {
    super(Log)
  }
}
