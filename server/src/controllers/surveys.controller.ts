import type { Request, Response, NextFunction } from 'express';
import * as surveysService from '../services/surveys.service.js';

export async function listSurveys(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await surveysService.listSurveys());
  } catch (err) {
    next(err);
  }
}

export async function getSurvey(req: Request, res: Response, next: NextFunction) {
  try {
    const survey = await surveysService.getSurvey(req.params.id);
    if (!survey) {
      res.status(404).json({ error: 'Survey not found' });
      return;
    }
    res.json(survey);
  } catch (err) {
    next(err);
  }
}

export async function createSurvey(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await surveysService.createSurvey(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function deleteSurvey(req: Request, res: Response, next: NextFunction) {
  try {
    await surveysService.deleteSurvey(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getResults(req: Request, res: Response, next: NextFunction) {
  try {
    const results = await surveysService.getResults(req.params.id);
    if (!results) {
      res.status(404).json({ error: 'Survey not found' });
      return;
    }
    res.json(results);
  } catch (err) {
    next(err);
  }
}
