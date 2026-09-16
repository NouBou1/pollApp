import type { Request, Response, NextFunction } from 'express';
import * as surveysService from '../services/surveys.service.js';

export async function submitResponse(req: Request, res: Response, next: NextFunction) {
  try {
    await surveysService.submitResponse(req.params.id, req.body);
    res.status(201).send();
  } catch (err) {
    next(err);
  }
}
