import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { Marker, marker } from 'leaflet';
import DriftMarker from 'leaflet-drift-marker';
import { MarkerService } from 'src/app/core/services/marker.service';
import { CustomPopupComponent } from '../custom-popup/custom-popup.component';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

interface MarkerMetaData {
  markerInstance: Marker;
  componentInstance: ComponentRef<CustomPopupComponent>
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  entry: any;
  length: any;

  map: any = L.map;
  marker: any = L.marker;
  markers: MarkerMetaData[] = [];

  @Input() map2: any;
  @Input() mapData: any;
  @Output() close = new EventEmitter();

  editMode = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private markerService: MarkerService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getMarkers();

    if (!this.mapData && this.length > 0) {
      this.map = this.map2;

      this.entry.forEach((element: any) => {
        const factory = this.resolver.resolveComponentFactory(CustomPopupComponent);
        const component = factory.create(this.injector);
        component.instance.data = element;
        component.instance.isEdit = false;
        component.changeDetectorRef.detectChanges();

        const marker = new DriftMarker([element.position?.lat, element.position?.lng], {
          draggable: true,
          icon: iconDefault,
        })
        const popupContent = component.location.nativeElement;
        marker.bindPopup(popupContent, { closeButton: false, closeOnClick: false })
        marker.addTo(this.map)
      });
    }

    if (changes.mapData && this.mapData?.latlng && !this.editMode) {
      this.map = this.map2;
      this.onMapClick(this.mapData);
    }
  }

  getMarkers() {
    this.length = this.markerService.getMarkers().length;
    this.entry = this.markerService.getMarkers();
  }

  onMapClick(data: any): void {
    const factory = this.resolver.resolveComponentFactory(CustomPopupComponent);
    const component = factory.create(this.injector);
    let m: any = new DriftMarker([data.latlng.lat, data.latlng.lng], {
      draggable: true,
      icon: iconDefault
    })

    this.markerService.addMarker({
      name: data.popup,
      markerInstance: m,
      componentInstance: component
    })

    this.getMarkers();
    component.instance.data = this.entry[this.length - 1];
    component.instance.isEdit = false;
    component.changeDetectorRef.detectChanges();

    this.markers.push({
      markerInstance: m,
      componentInstance: component
    });

    const popupContent = component.location.nativeElement;
    m.bindPopup(popupContent, { closeButton: false, closeOnClick: false })
    m.addTo(this.map)
      .openPopup();

    component.instance.outputEvent.subscribe(val => {
      this.editMode = true;

      if (val === 'close') {
        component.instance.isEdit = false;
        component.changeDetectorRef.detectChanges();
        m.closePopup();

        setTimeout(() => {
          this.editMode = false;
        }, 1);
      } else {
        component.instance.isEdit = true;
        component.changeDetectorRef.detectChanges();
      }
    });
  }

  submitMap() {
    this.close.emit();
  }
}
