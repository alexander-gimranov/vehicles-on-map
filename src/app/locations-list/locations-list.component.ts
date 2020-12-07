import { Component, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { LocationInfo } from 'src/models/LocationInfo';
import { AppService } from '../app.service';
import { worldMap } from 'src/app/maps/WorldMap';
import { Maps, Zoom, Marker, MapsTooltip, MarkerBase, ISelectionEventArgs } from '@syncfusion/ej2-angular-maps';
import { UserInfo } from 'src/models/UserInfo';
import { Subscription } from 'rxjs/internal/Subscription';
import { interval } from 'rxjs/internal/observable/interval';

Maps.Inject(Marker, MapsTooltip, Zoom);

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LocationsListComponent implements OnDestroy {
  @ViewChild('maps')
  public maps: Maps;

  public locations: LocationInfo[];
  public selected: number;

  public carImg = "src/assets/images/person-icon.png";

  constructor(private appService: AppService) { }

  private updateSubscription: Subscription;
  
  private _user: UserInfo;
  get User(): UserInfo {
      return this._user;
  }
  @Input() set user(value: UserInfo) {
    this._user = value;
    this.selected = undefined;
    if (this.updateSubscription) this.updateSubscription.unsubscribe();
    this.getLocations();
    this.updateSubscription = interval(60000).subscribe(
      (val) => { 
        console.log('reload ' + new Date());
        this.getLocations()
      });
    
  }

  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
  }

  private getLocations() {
    return this.appService.getLocations(this._user.userid).subscribe(list => {
      this.locations = list.data;
      this.UpdateMap();
    });
  }

  public SelectVehicle(vehicleId: number) {
    this.selected = this.selected !== vehicleId ? vehicleId : undefined;
    this.UpdateMap();
  }

  private UpdateMap() {
    if (this.locations.length === 0) return;
    this.maps.layers[0].markerSettings[0].dataSource =
      this.locations
        .filter(l => (this.selected == undefined || l.vehicleid === this.selected) && l.lat != null && l.lon != null)
        .map(loc => {
          let vehicle = this.User.vehicles.find(v => v.vehicleid == loc.vehicleid);
          let name: string = vehicle.make + ' ' + vehicle.model;
          return {
            latitude: loc.lat,
            longitude: loc.lon,
            name: name,
            color: vehicle.color
          };
        });
    this.maps.refresh();
  }

  private shapeData: object = worldMap;
  private shapePropertyPath: String = 'name';
  private shapeDataPath: String = 'Country';
  private dataSource: Object[] = [
    { "Country": "China", "Membership": "Permanent" },
    { "Country": "France", "Membership": "Permanent" },
    { "Country": "Russia", "Membership": "Permanent" },
    { "Country": "Kazakhstan", "Membership": "Non-Permanent" },
    { "Country": "Poland", "Membership": "Non-Permanent" },
    { "Country": "Sweden", "Membership": "Non-Permanent" }
  ];
  private shapeSettings: Object = {
    autofill: true
  };  

  public zoomSettings: object = {
    enable: true,
    horizontalAlignment: 'Near',
    shouldZoomInitially: true,
    toolbars: ['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'],
    zoomFactor: 1
  };

  public layers: object[] = [{
    shapeData: this.shapeData,
    shapePropertyPath: this.shapePropertyPath,
    shapeDataPath: this.shapeDataPath,
    dataSource: this.dataSource,
    shapeSettings: this.shapeSettings,
    markerSettings: [{
      visible: true,
      border: {color: 'black', width: 1},
      dataSource: [],
      height: 20,
      width: 20,
      colorValuePath:'color',
      tooltipSettings: { visible: true, valuePath: 'name' },
      animationDuration: 0
    }]
  }];

  public tooltipSettings: Object = {
    visible: true,
    valuePath: 'name'
  };

  public highlightSettings: {
    enable: true,
    fill: '#A3B0D0'
  };
}
