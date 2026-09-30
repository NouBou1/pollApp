import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {
  CreateSurveyPayload,
  SubmitResponsePayload,
  SurveyDetail,
  SurveyListItem,
  SurveyResults,
} from '../models/survey.model';
import * as db from './survey-db';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  listSurveys(): Observable<SurveyListItem[]> {
    return from(db.listSurveys());
  }

  getSurvey(id: string): Observable<SurveyDetail> {
    return from(db.getSurvey(id));
  }

  createSurvey(payload: CreateSurveyPayload): Observable<{ id: string }> {
    return from(db.createSurvey(payload));
  }

  getResults(id: string): Observable<SurveyResults> {
    return from(db.getResults(id));
  }

  submitResponse(id: string, payload: SubmitResponsePayload): Observable<void> {
    return from(db.submitResponse(id, payload));
  }
}
