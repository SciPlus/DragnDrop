import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IndivLabPage } from './indivlab';


@NgModule({
  declarations: [
    IndivLabPage,
  ],
  imports: [
    IonicPageModule.forChild(IndivLabPage),
  ],
  exports: [
    IndivLabPage
  ]
})
export class IndivLabPageModule {}