import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { IndivLabPage } from '../indivlab/indivlab';
import { Lab } from '../../app/models/lab';
import { LabService } from '../../services/lab.service';

import { User } from '../../app/models/user';
import { UserService } from '../../services/user.service';

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
      entryCode: "",
      name: "",
      originalCreator: "",
      combinationsIDs: [],
      materialsIDs: [],
      isFinished: false
    }
    userId: string;
    labUser: string = "";
    helperText: string;
    users: any;
    myUser: User;
    userFound: boolean = false;
  constructor(private userService: UserService, public navParams: NavParams, private comboService: CombinationService, private materialService: MaterialService, private labService: LabService, public actionSheetCtrl: ActionSheetController, private fire: AngularFireAuth, public navCtrl: NavController, public alertCtrl: AlertController) {
    this.email = this.fire.auth.currentUser.email;
    this.userId = this.fire.auth.currentUser.uid;
    this.myUser = this.navParams.data;
    this.userFound = true;
    console.log("MyUser after getting it from nav.Params.data (userName)" + this.myUser.userName);
    this.users = this.userService.getUsers(); // getting users in database
    this.myUser.labIds = this.userService.getUserLabIds(this.myUser);
  };
  getMyLabs() {
      console.log("this.myUser.labIds on page: " + this.myUser.labIds);
      return this.labService.getLabs(this.myUser.labIds);
  }
  // called to assign each lab its own entry code
  generateRandomLabCode(length: number) {
    let text: string = "";
    console.log("generate random being  called");
    let possibleValues = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let index = 0; index < length; index++) {
      text = possibleValues.charAt(Math.floor(Math.random() * possibleValues.length)) + text;
    }
    return text;
  }
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
      console.log(`Current material: ${material.name}`);
      this.materialService.deleteMaterial(material);
    })
    
    // delete individual combination
    let labIdIndex = this.myUser.labIds.indexOf(lab.id);
    this.myUser.labIds.splice(labIdIndex, labIdIndex+1);
    this.labService.deleteLab(lab);
  }
  goToIndivLabPage(lab: Lab) {
    this.navCtrl.push(IndivLabPage, lab);
  }
  // method to be used after lab created (in onSubmit() function)
  onSubmit() {
    this.newLab.entryCode = this.generateRandomLabCode(8); // generating specific entry code to lab --> display later in html 
    this.newLab.originalCreator = this.userId; // assigning the id to original Creator
    this.newLab.combinationsIDs = [];
    this.newLab.materialsIDs = [];
    this.newLab.isFinished = false;
    this.newLab.isFoundIDs = [];
    if((this.newLab.name != "") && (this.newLab.originalCreator != "") && (this.newLab.entryCode != "")) {

      let ref = this.labService.addLab(this.newLab);
      ref.then(c => { this.myUser.labIds.push(c.id);
        this.userService.updateUser(this.myUser);
      });
      this.newLab.name = "";
      this.newLab.entryCode = "";
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