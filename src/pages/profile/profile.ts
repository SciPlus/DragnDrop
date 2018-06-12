import { Component , ViewChild} from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { TaliaPage } from '../talia/talia';
import { IndivLabPage } from '../indivlab/indivlab';
import { Lab } from '../../app/models/lab';
import { LabService } from '../../services/lab.service';
import { ActionSheetController } from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
    email: string;
    newLab: Lab = {
      name: "",
      originalCreator: "",
      combinationsIDs: [],
      materialsIDs: [],
    }
    userId: any;
    labUser: string = "";
  
  constructor(public navParams: NavParams, private labService: LabService, public actionSheetCtrl: ActionSheetController, private fire: AngularFireAuth, public navCtrl: NavController, public alertCtrl: AlertController) {
    this.email = this.fire.auth.currentUser.email;
    this.userId = this.fire.auth.currentUser.uid;
  };
  deleteLab(lab: Lab) {
    this.labService.deleteLab(lab);
  }
  goToIndivLabPage(lab: Lab) {
    this.navCtrl.push(IndivLabPage, lab);
  }
  onSubmit() {
    this.newLab.originalCreator = this.userId; // assigning the id to original Creator
    this.newLab.combinationsIDs = [];
    this.newLab.materialsIDs = [];
    if((this.newLab.name !== "") && (this.newLab.originalCreator !== "")) {
      this.labService.addLab(this.newLab);
      this.newLab.name = "";
      this.newLab.combinationsIDs = [];
      this.newLab.materialsIDs = [];
      this.newLab.originalCreator = "";
    }
    else {
      // ~~ERROR~~ need to change if statement, doesn't work if the firnla one is put in before the first one. As they type into fields, the fields should be updating. (two way data binding)
      alert('Field input is incorrect. Be sure to title your lab.');
      this.newLab.name = "";
      this.newLab.originalCreator = "";
      this.newLab.combinationsIDs = [];
      this.newLab.materialsIDs = [];
    }
  }
  labSettings(lab) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your material',
      buttons: [
        {
          text: 'Details',
          role: 'details',
          handler: () => {
          this.goToIndivLabPage(lab);
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteLab(lab);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    actionSheet.present();
  }
}