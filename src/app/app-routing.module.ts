import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BridgeComponent } from './bridge/bridge.component';

const routes: Routes = [{
  path:'',
  component:BridgeComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
