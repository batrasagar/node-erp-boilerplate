import { Request, Response, NextFunction } from 'express';
import { ValidationError as SequelizeValidationError, UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';
import logger from '../utils/logger.util';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      success: false,
      message: 'A record with this information already exists',
    });
    return;
  }

  if (err instanceof SequelizeValidationError) {
    const errors = err.errors.reduce((acc, e) => {
      const field = e.path || 'field';
      if (!acc[field]) acc[field] = [];
      acc[field].push(e.message);
      return acc;
    }, {} as Record<string, string[]>);
    res.status(422).json({ success: false, message: 'Validation failed', errors });
    return;
  }

  if (err instanceof ForeignKeyConstraintError) {
    res.status(409).json({
      success: false,
      message: 'Cannot perform this operation due to related records',
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};
