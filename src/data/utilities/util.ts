import { Request, Response } from 'express';

export const jSendError = (
  res: Response,
  msg: any,
  code: number,
  data: any
) => {
  res.status(code).json({
    message: msg,
    status: 'error',
    data,
  });
};

export const jSendFailure = (
  res: Response,
  msg: any,
  code: number,
  data: any
) => {
  res.status(code).json({
    message: msg,
    status: 'error',
    data,
  });
};

export const jSendSuccess = (
  _req: Request,
  res: Response,
  msg: any,
  data?: any
) => {
  res.status(200).json({
    message: msg,
    status: 'success',
    data,
  });
};

export const welcomeMessage = 'My Rule-Validation API';
export const details = {
  name: 'Kazeem Oluwatobi Odutola',
  github: '@tobslob',
  email: 'odutola_k@yahoo.ca',
  mobile: '07039387595',
  twitter: '@tobslob_',
};
export const notFoundError = 'Whoops! Route not found.';
export const internalServerError = 'Internal server error.';
