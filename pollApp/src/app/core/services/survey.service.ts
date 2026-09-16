import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateSurveyPayload,
  SubmitResponsePayload,
  SurveyDetail,
  SurveyListItem,
  SurveyResults,
} from '../models/survey.model';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private readonly baseUrl = '/api/surveys';

  constructor(private readonly http: HttpClient) {}

  listSurveys(): Observable<SurveyListItem[]> {
    return this.http.get<SurveyListItem[]>(this.baseUrl);
  }

  getSurvey(id: string): Observable<SurveyDetail> {
    return this.http.get<SurveyDetail>(`${this.baseUrl}/${id}`);
  }

  createSurvey(payload: CreateSurveyPayload): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.baseUrl, payload);
  }

  deleteSurvey(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getResults(id: string): Observable<SurveyResults> {
    return this.http.get<SurveyResults>(`${this.baseUrl}/${id}/results`);
  }

  submitResponse(id: string, payload: SubmitResponsePayload): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/responses`, payload);
  }
}
