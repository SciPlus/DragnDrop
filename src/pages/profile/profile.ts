import { Component, OnInit } from '@angular/core';
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
      purpose: "",
      entryCode: "",
      sharedWith: [],
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
    myUserIds: String[];
    entryCodeAttempt: String = "";
    userFound: boolean = false;
    currentLabs: Lab[] = [];

  constructor(private userService: UserService, public navParams: NavParams, private comboService: CombinationService, private materialService: MaterialService, private labService: LabService, public actionSheetCtrl: ActionSheetController, private fire: AngularFireAuth, public navCtrl: NavController, public alertCtrl: AlertController) {
    this.myUser = this.navParams.data;
    this.myUserIds = this.userService.getUserLabIds(this.myUser);
    this.userFound = true;
    console.log("current labs" + this.currentLabs);
    this.email = this.fire.auth.currentUser.email;
    this.userId = this.fire.auth.currentUser.uid;
    this.users = this.userService.getUsers(); // getting users in database
    console.log("check show labs");
    this.currentLabs = this.labService.getLabs(this.myUserIds);
  };
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
  joinLab() {
    let labCodes = this.labService.getEntryCodes();
    console.log("labCodes: " + labCodes);
    if (labCodes.indexOf(this.entryCodeAttempt) !== -1) {
      let labs = this.labService.getAllLabs();
      let newLab = labs.find(lab => lab.entryCode == this.entryCodeAttempt);
      if (this.myUserIds.indexOf(newLab.id) ==  -1) {
        this.myUser.myLabs.push({labId: newLab.id, isFoundIds:[]});
        this.userService.updateUser(this.myUser);
      }
    }
  }
  addPurposeConfirm(lab: Lab) {
    let alert = this.alertCtrl.create({
      title: 'Edit Purpose',
      message: 'What is the purpose of this lab?',
      inputs: [
        {
          name: 'Purpose',
          placeholder: 'The purpose of this lab is to ...'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: (purpose: string) => {
            lab.purpose = purpose;
            this.labService.updateLab(lab);
          }
        }
      ]
    });
    alert.present();
  }
  addInvitationConfirm(lab: Lab) {
    let alert = this.alertCtrl.create({
      title: 'Invite Others',
      message: 'Who would you like to invite?',
      inputs: [
        {
          name: 'Email',
          placeholder: 'labplus@labplus.com'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Invite',
          handler: otherUserName => { //just collecting/comparing username for now
            let userNames = this.userService.getUserNames();
            if (userNames.indexOf(otherUserName.Email) !== -1) { // make sure other user exists
              let otherUser = this.users.find(user => user.userName == otherUserName.Email);
              // make sure not already in lab.sharedWith
              if (lab.sharedWith.indexOf(otherUser.userId) == -1) { // make sure it is not already in list
                lab.sharedWith.push(otherUser.userId);
                this.labService.updateLab(lab);
              } this.alert("You have already joined this lab.");
              // you already have this lab
            } this.alert("This user is not registered with LabPlus");// else the user is not registered ( but alert is not working right now )
              // add message to other user or send to their notifications later
          }
        }
      ]
    });
    alert.present();
  }
  alert(message: String) {
    alert(message);
  }
  addInvitation(lab: Lab) {
    this.addInvitationConfirm(lab);
  }
  addPurpose(lab: Lab) {
    this.addPurposeConfirm(lab);
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
    
    // delete individual lab
    let i = 0;
    this.myUser.myLabs.forEach((myLab) => {
      if (myLab.labId == lab.id) {
        this.myUser.myLabs.splice(i,i+1);
        this.labService.deleteLab(lab);
      }
      i++;
    })
  }
  goToIndivLabPage(lab: Lab) { // lab from lab db 
    this.navCtrl.push(IndivLabPage,{data1: lab, data2: this.myUser}); 
  }
  // method to be used after lab created (in onSubmit() function)
  onSubmit() {
    this.newLab.entryCode = this.generateRandomLabCode(8); // generating specific entry code to lab --> display later in html 
    this.newLab.originalCreator = this.userId; // assigning the id to original Creator
    this.newLab.combinationsIDs = [];
    this.newLab.sharedWith = [];
    this.newLab.materialsIDs = [];
    this.newLab.isFinished = false;
    this.newLab.purpose = "";
    if((this.newLab.name != "") && (this.newLab.originalCreator != "") && (this.newLab.entryCode != "")) {

      let ref = this.labService.addLab(this.newLab);
      ref.then(c => {
        this.myUser.myLabs.push({labId: c.id.toString(), isFoundIds: []});        
        this.userService.updateUser(this.myUser);
      });
      this.newLab.name = "";
      this.newLab.entryCode = "";
      this.newLab.sharedWith = [];
      this.newLab.purpose = "";
      this.newLab.combinationsIDs = [];
      this.newLab.materialsIDs = [];
      this.newLab.originalCreator = "";
      this.newLab.isFinished = false;
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