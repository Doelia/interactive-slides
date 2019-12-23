import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SlidesComponent} from "./slides/slides.component";
import {PoolComponent} from "./pool/pool.component";


const routes: Routes = [
  { path: 'project/:id/pool', component: PoolComponent },
  { path: 'project/:id', component: SlidesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
