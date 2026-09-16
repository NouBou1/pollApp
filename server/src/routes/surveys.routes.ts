import { Router } from 'express';
import * as surveysController from '../controllers/surveys.controller.js';
import * as responsesController from '../controllers/responses.controller.js';
import { validateBody } from '../middleware/validateBody.js';
import { createSurveySchema, submitResponseSchema } from '../types/dto.js';

export const surveysRouter = Router();

surveysRouter.get('/', surveysController.listSurveys);
surveysRouter.post('/', validateBody(createSurveySchema), surveysController.createSurvey);
surveysRouter.get('/:id', surveysController.getSurvey);
surveysRouter.delete('/:id', surveysController.deleteSurvey);
surveysRouter.get('/:id/results', surveysController.getResults);
surveysRouter.post(
  '/:id/responses',
  validateBody(submitResponseSchema),
  responsesController.submitResponse,
);
