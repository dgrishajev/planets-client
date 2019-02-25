import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import ApiService from './api.service';
import Planet from '../models/planet.model';

@Injectable()

export default class PlanetsService {

  constructor(private apiService: ApiService) {}

  findAll(): Observable<Planet[]> {
    return this.apiService.find('planets').pipe(map(response => response.json()));
  }

  findOne(id): Observable<Planet> {
    return this.apiService.find(`planets/${id}`).pipe(map(response => response.json()));
  }
}
