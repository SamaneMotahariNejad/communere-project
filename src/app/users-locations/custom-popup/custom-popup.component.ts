import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as L from 'leaflet';
import { marker } from 'leaflet';
import { MarkerService } from 'src/app/core/services/marker.service';

@Component({
  selector: 'app-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrls: ['./custom-popup.component.scss']
})
export class CustomPopupComponent implements OnInit {
  outputEvent = new Subject<string>();

  @Input('data') data!: any;
  @Input() isEdit = false;

  constructor(
    private markerService: MarkerService
  ) { }

  ngOnInit(): void {
  }

  edit() {
    this.outputEvent.next('change');
  }

  sendData() {
    this.outputEvent.next('close');
    this.markerService.changeMarkerData(this.data);
  }

  close() {
    this.outputEvent.next('close');
  }
}
