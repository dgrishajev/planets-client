import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MatTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import ApiService from './services/api.service';
import PlanetsService from './services/planets.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    MatTableModule,
    BrowserAnimationsModule,
  ],
  providers: [ApiService, PlanetsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
