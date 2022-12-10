import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      loadChildren: () => import('./users-locations/users-locations.module').then(d => d.UsersLocationsModule),
    },
  ]
}];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
