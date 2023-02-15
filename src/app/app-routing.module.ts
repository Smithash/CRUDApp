import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "./administration/users/users.component";
import {HomeComponent} from "./home/home.component";
import {EditComponent} from "./administration/users/edit/edit.component";

const routes: Routes = [{
  path : "",
  redirectTo: "list",
  pathMatch: "full"
},
  {
    //define path for each folder
    path: "",
    component: HomeComponent,
  },

  {
    path: "users",
    component: UsersComponent,
  },
  {
    path:"edit",
    component: EditComponent
  },
  {
    path: "**",
    redirectTo: ""
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
