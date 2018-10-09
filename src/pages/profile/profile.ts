import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { IndivLabPage } from '../indivlab/indivlab';
import { Lab } from '../../app/models/lab';
import { LabService } from '../../services/lab.service';

import { CombinationService } from '../../services/combination.service';
import { MaterialService } from '../../services/material.service';
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
      isFinished: false
    }
    userId: any;
    labUser: string = "";
    helperText: string;
  constructor(public navParams: NavParams, private comboService: CombinationService, private materialService: MaterialService, private labService: LabService, public actionSheetCtrl: ActionSheetController, private fire: AngularFireAuth, public navCtrl: NavController, public alertCtrl: AlertController) {
    this.email = this.fire.auth.currentUser.email;
    this.userId = this.fire.auth.currentUser.uid;
  };
  deleteLab(lab: Lab) {
    let currentCombos = this.comboService.getCombos(lab.combinationsIDs);
    console.log(`Current combos: ${currentCombos}`);

    currentCombos.forEach(combo => {
      console.log(`Current combo: ${combo}`);
      this.comboService.deleteCombo(combo);
    });
    let currentMaterials = this.materialService.getMaterials(lab.materialsIDs);
    console.log(`Current materials: ${currentMaterials}`);

    currentMaterials.forEach(material => {
      console.log(`Current material: ${material}`);
      this.materialService.deleteMaterial(material);
    })
    this.labService.deleteLab(lab);
  }
  goToIndivLabPage(lab: Lab) {
    this.navCtrl.push(IndivLabPage, lab);
  }
  onSubmit() {
    this.newLab.originalCreator = this.userId; // assigning the id to original Creator
    this.newLab.combinationsIDs = [];
    this.newLab.materialsIDs = [];
    this.newLab.isFinished = false;
    this.newLab.isFoundIDs = [];
    if((this.newLab.name !== "") && (this.newLab.originalCreator !== "")) {
      this.labService.addLab(this.newLab);
      this.newLab.name = "";
      this.newLab.combinationsIDs = [];
      this.newLab.materialsIDs = [];
      this.newLab.originalCreator = "";
      this.newLab.isFinished = false;
      this.newLab.isFoundIDs = [];
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
  presentConfirm(lab) {
    let alert = this.alertCtrl.create({
      title: 'Confirm deletion',
      message: 'Are you sure you want to delete this lab?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteLab(lab);
          }
        }
      ]
    });
    alert.present();
  }
  labSettings(lab) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your lab',
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
            this.presentConfirm(lab);
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