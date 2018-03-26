import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaliaPage } from './talia';


@NgModule({
  declarations: [
    TaliaPage,
  ],
  imports: [
    IonicPageModule.forChild(TaliaPage),
  ],
  exports: [
    TaliaPage
  ]
})
export class TaliaPageModule {}