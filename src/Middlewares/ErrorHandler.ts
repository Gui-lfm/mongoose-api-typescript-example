import { NextFunction, Request, Response } from 'express';

class ErrorHandler {
  public static Handle(
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    res.status(500).json({ message: error.message });
    next();
  }
}

export default ErrorHandler;