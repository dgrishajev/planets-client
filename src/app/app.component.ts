import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatSort } from '@angular/material';
import { take } from 'rxjs/operators';
import approx from 'approximate-number';

import ApiService from './services/api.service';
import PlanetsService from './services/planets.service';
import Planet from './models/planet.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  dataSource;
  planets$: Observable<Planet[]>;
  planets: Planet[];
  planetsSubscription: Subscription;
  columnsToDisplay = ['name', 'terrain', 'population', 'residentsAmount', 'filmsAmount'];
  expandedElement: PlanetRow | null;
  expandedData = {};

  @ViewChild(MatSort) sort: MatSort;

  static formatPopulation(amount) {
    if (!isNaN(amount)) {
      return approx(amount);
    }
    return `${amount.charAt(0).toUpperCase()}${amount.slice(1)}`;
  }

  constructor(private planetsService: PlanetsService, private apiService: ApiService) {
    this.planets$ = this.planetsService.findAll();
  }

  ngOnInit() {
     this.planetsSubscription = this.planets$.subscribe(planets => {
       this.planets = planets;
       this.createTable();
     });
  }

  ngOnDestroy() {
    if (this.planetsSubscription) {
      this.planetsSubscription.unsubscribe();
    }
  }

  createTable() {
    const tableArr: PlanetRow[] = this.planets.map(
      ({
        name,
        terrain,
        population,
        residents,
        films,
      }) => ({
        name,
        terrain,
        population: this.constructor.formatPopulation(population),
        residentsAmount: residents.length,
        filmsAmount: films.length,
      })
    );
    this.dataSource = new MatTableDataSource(tableArr);
    this.dataSource.sort = this.sort;
  }

  expandElement(element) {
    this.expandedElement = this.expandedElement === element ? null : element;
    const { name, films, residents } = this.planets.find(({ name: planetName }) => planetName === element.name);
    if (!this.expandedData[name]) {
      this.expandedData[name] = {
        films: [],
        residents: [],
      };
      films.map(url => this.apiService
        .find(url, true)
        .pipe(take(1))
        .subscribe(film => {
          this.expandedData[name].films.push(film.title);
        })
      );
      residents.map(url => this.apiService
        .find(url, true)
        .pipe(take(1))
        .subscribe(resident => {
          this.expandedData[name].residents.push(resident.name);
        })
      );
    }
  }
}

interface PlanetRow {
  name: string;
  terrain: string;
  population: number | string;
  residentsAmount: number;
  filmsAmount: number;
}
