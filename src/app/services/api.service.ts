import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export default class ApiService {
  baseUrl = 'http://localhost:3000';

  static parseApiError(err: Response) {
    try {
      return Observable.throw({
        status: err.status,
        isHttpError: true,
        error: err.json()
      });
    } catch (error) {
      return Observable.throw({
        isHttpError: false,
        error: 'Unknown error occured'
      });
    }
  }

  constructor(private http: Http) {}

  find(url: string, absolute: boolean, options: any = {}): Observable<Response> {
    return absolute
      ? this.http.get(url, { ...options }).pipe(map(response => response.json()))
      : this.http.get(`${this.baseUrl}/${url}`, { ...options });
  }
}
