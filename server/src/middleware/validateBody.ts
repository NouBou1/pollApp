import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';

export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Invalid request body', details: result.error.flatten() });
      return;
    }
    req.body = result.data;
    next();
  };
}
