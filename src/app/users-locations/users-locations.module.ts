import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CustomPopupComponent } from './custom-popup/custom-popup.component';
import { UsersLocationsComponent } from './users-locations.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from './map/map.component';
import { MarkerService } from '../core/services/marker.service';
import { UtilityService } from '../core/services/utility.service';
import { StorageService } from '../core/services/storage.service';

const routes: Routes = [
  {
    path: '',
    component: UsersLocationsComponent,
  }
];

@NgModule({
  declarations: [
    UsersLocationsComponent,
    CustomPopupComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  providers: [
    MarkerService,
    UtilityService,
    StorageService
  ],
})
export class UsersLocationsModule { }
