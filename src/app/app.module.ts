import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UsersListComponent } from './users-list/users-list.component';
import { LocationsListComponent } from './locations-list/locations-list.component';

import { AnnotationsService, BubbleService, DataLabelService, LegendService, MapsModule, MapsTooltipService, MarkerService, SelectionService, ZoomService } from '@syncfusion/ej2-angular-maps';
import { HttpRequestCache } from 'src/app/httprequestcache';

@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent,
    LocationsListComponent    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MapsModule
  ],
  providers: [LegendService, MarkerService, MapsTooltipService, DataLabelService, BubbleService, SelectionService, AnnotationsService, ZoomService, HttpRequestCache],
  bootstrap: [AppComponent]
})
export class AppModule { }
