import { Component, OnInit, TemplateRef } from '@angular/core';
import * as L from 'leaflet';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarkerService } from '../core/services/marker.service';
import DriftMarker from 'leaflet-drift-marker';
import { StorageService } from '../core/services/storage.service';

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

@Component({
  selector: 'app-users-locations',
  templateUrl: './users-locations.component.html',
  styleUrls: ['./users-locations.component.scss']
})
export class UsersLocationsComponent implements OnInit {
  userForm!: FormGroup<any>;

  map: any = L.map;
  map2: any = L.map;
  mapData = null;

  fileToUpload: File | null = null;
  imageUrl: any;

  modalRef?: BsModalRef;
  modalRefMap?: BsModalRef;

  userLocations: any[] = [];

  config = {
    keyboard: true,
    class: 'userModal',
    ignoreBackdropClick: true
  };

  configMap = {
    keyboard: true,
    class: 'mapModal'
  };

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private markerService: MarkerService,
    private storageSV: StorageService,
  ) { }

  ngOnInit(): void {
    this.initializeData();

    const users = this.storageSV.get('userLocations');
    if (users) {
      this.userLocations = users;
    }
  }

  initializeData() {
    this.userForm = this.formBuilder.group({
      locationName: ['', Validators.required],
      locationMap: [[], Validators.required],
      locationType: ['Business', Validators.required],
      logo: ['']
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
    this.initMap();
  }

  openMap(template: TemplateRef<any>) {
    this.modalRefMap = this.modalService.show(template, this.configMap);
    this.initMap2();
  }

  initMap() {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  initMap2() {
    this.map2 = L.map('map2', {
      center: [39.8282, -98.5795],
      zoom: 3
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map2);

    this.map2.on('click', (e: any) => {
      this.mapData = e;
    });
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file[0];
    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  submitMap() {
    this.modalRefMap?.hide();
    this.modalRefMap = undefined;
    this.mapData = null;

    var entry: any = this.markerService.getMarkers();
    entry.forEach((element: any) => {
      const marker = new DriftMarker([element.position?.lat, element.position?.lng], {
        draggable: true,
        icon: iconDefault,
      })
      marker.addTo(this.map)
    });

    this.userForm['controls'].locationMap.setValue(entry[0].position?.lat, entry[0].position?.lng)

    this.map.setView(
      [entry[0].position?.lat, entry[0].position?.lng],
      13
    );

  }

  closeInfo() {
    this.modalRef?.hide();
    this.modalRef = undefined;
    this.markerService.removeLastMarkers();
  }

  saveInfo() {
    this.modalRef?.hide();
    this.modalRef = undefined;
    this.userLocations.push(
      { user: {} }
    )

    this.userLocations[this.userLocations.length - 1].user = {
      locationName: this.userForm['controls'].locationName.value,
      locationType: this.userForm['controls'].locationType.value,
      locationMap: this.markerService.getMarkers(),
      logo: this.imageUrl
    }

    this.storageSV.set('userLocations', this.userLocations);

    setTimeout(() => {
      this.mapData = null;
      this.markerService.removeLastMarkers();
      this.userForm.reset();
      this.userForm['controls'].locationType.setValue('Business')
    }, 500);
  }
}
