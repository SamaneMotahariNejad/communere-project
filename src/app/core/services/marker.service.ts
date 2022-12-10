import { Injectable } from '@angular/core';
import { Marker } from '../models/markers';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  markers: Marker[] = [];

  getMarkers() {
    return this.markers;
  }

  addMarker(data: any): any {
    return this.markers.push(
      {
        id: this.markers.length + 1,
        name: 'Location Title ' + (this.markers.length + 1),
        description: 'Details ' + (this.markers.length + 1),
        position: data.markerInstance._latlng
      }
    );
  }

  changeMarkerData(data: any) {
    let find = this.markers.find(e => e.id === data.id);
    if (find) {
      find = data;
    }
  }

  removeLastMarkers() {
    this.markers = [] = [];
  }
}
