// for a future update, maybe consider adding different mole ratios of substances to produce other substances. 
// for now, any number of the substances will combine.
// request for lab. 
// teacher 
// teacher in class 103, 103 is over
// institution makes 
// password for each period. 
// id/password --> access lab. Control for the teacher.
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SubmitPage } from '../submit/submit';
import { AngularFireAuth } from 'angularfire2/auth';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../app/models/Material';
import { CombinationService } from '../../services/combination.service';
import { LabService } from '../../services/lab.service';

import { Combo } from '../../app/models/combo';
import { Lab } from '../../app/models/lab';
import { SigninPage } from '../signin/signin';

import { User } from '../../app/models/user';
import { UserService } from '../../services/user.service';

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage implements OnInit{
  showContent = "";
  isFoundIds: String[] = [];
  existingIsFoundMaterials: Material[] = [];
  email: string;
  buttonClicked = false;
  ingred: Object;
  countOfComboElements: number = 0;
  addedItem: object = {};
  helperText1: string = "";
  helperText2: number = 0;
  newComboCreated: boolean = false;
  numberOfFoundIngredients: number = 0;
  countOfFoundElements: number = 0;
  materialToDefine: Material;
  defineState: boolean = false;
  material: Material = {
    name: "",
    definition: "",
    isStartingMaterial: false,
    isFinalMaterial: false,
    img: "",
    id: "",
  }
  materials: Material[];
  Reaction_Components1: Material[] = []; /// setting to a value;
  rawCombinations: Combo[];
  myLab: Lab;
  myUser: User;
  myUserIsFoundIds: String[];
  

  constructor(private userService: UserService, public alertCtrl: AlertController, private labService: LabService, private combinationService: CombinationService, private materialService: MaterialService, private fire: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
    this.email = fire.auth.currentUser.email;
    this.myLab = this.navParams.data.data1; // lab from lab db
    this.myUser = this.navParams.data.data2; // user from user db
    this.materials = this.materialService.getMaterials(this.myLab.materialsIDs);

    
    this.myUserIsFoundIds = this.userService.getUserIsFoundIds(this.myUser.userId, this.myLab.id);
    this.getExistingMaterials(this.myUserIsFoundIds);
    this.rawCombinations = this.combinationService.getCombos(this.myLab.combinationsIDs);
    this.showContent = "Purpose";
    console.log("show content is purpose");
    console.log("myLab.purpose: " + this.myLab.purpose);
  }
  showRedoButton() {
    if (this.myLab.isFinished) {
      var i = document.getElementById("redoButton");
      i.style.display = "block";
    }
  }
  ngOnInit() {
    console.log('talia page is running');
    this.showRedoButton();
  };
  getMyMaterials() {
    console.log("My lab materials are: " + this.myLab.materialsIDs);
    return this.materialService.getMaterials(this.myLab.materialsIDs);
  }
  getExistingMaterials(IDs: String[] ) {
    this.materials.forEach(material => {
      let boolean = IDs.indexOf(material.id) >= 0;
      console.log(`Here: ${boolean}`);

      if ((IDs.indexOf(material.id) >= 0) && (this.existingIsFoundMaterials.indexOf(material) === -1)) { // (it exists)
        this.existingIsFoundMaterials.push(material);
        console.log(` Did We Get The Existing Materials ? ${this.existingIsFoundMaterials}`);
      }
    })
  }
  // Is Found Service Functions Transferred to TaliaPage
  addFoundMaterial(material: Material) { // this will be changed to incoroporate myLab.isFoundIds
    if (this.myUserIsFoundIds.indexOf(material.id) === -1) {
      this.myUserIsFoundIds.push(material.id);
        this.existingIsFoundMaterials.push(material);
    }
  }
  deleteFoundMaterial(material: Material) { // is there really a purpose for this?
    let isFoundIndex =  this.myUserIsFoundIds.indexOf(material.id);
    this.myUserIsFoundIds.splice(isFoundIndex, isFoundIndex+1);
    this.labService.updateLab(this.myLab);
  }
  // continue **
  defineMaterial(event, material: Material) {
    this.defineState = true;
    this.materialToDefine = material;
  }
  clearState() {
    this.Reaction_Components1 = [];
  }
  openSubmitPage() {
    this.navCtrl.push(SubmitPage);
  }
  checkCombo() {
    var correctCombo;
    if (this.Reaction_Components1.length == 2) {
    // finding combination that matches reaction components;
    this.rawCombinations.forEach(combo => {
      if ((combo.ingredients[0].id === this.Reaction_Components1[0].id) && (combo.ingredients[1].id === this.Reaction_Components1[1].id) || 
      (combo.ingredients[0].id === this.Reaction_Components1[1].id) && (combo.ingredients[1].id === this.Reaction_Components1[0].id)) {
        correctCombo = combo;
      }
    });
    if (correctCombo) {
      this.completeCheck(correctCombo);
      this.getExistingMaterials(this.myUserIsFoundIds);

    } else {
      this.failToCombineMessage();
      this.Reaction_Components1 = [];
    }
    }
  }
  completeCheck(correctCombo: Combo) {
    let myResult = this.materials.find((newMaterial) => {
      return (newMaterial.id === correctCombo.result.id);
    });
    this.addFoundMaterial(myResult);
    if (myResult.isFinalMaterial === true) {
      this.myLab.isFinished = true;
      this.showDoneButton();
      this.completionMessage();
      // change sidebar menu from materials to Materials when complete
      this.showContent = "Materials";
      console.log("show content is material");
      this.labService.updateLab(this.myLab);
    } else if (this.myUserIsFoundIds.indexOf(myResult.id) != -1) { // otherwise if the result is already found
      this.foundMessage();
    } else {
      this.combineMessage();
    }
    this.Reaction_Components1 = [];
  }
  failToCombineMessage() {
    var f = document.getElementById("failureMessage");
    f.className = "show";
    setTimeout(function () { f.className = f.className.replace("show", ""); }, 3000);
  }
  completionMessage() {
    var z = document.getElementById("completionMessage");
    z.className = "reveal";
    setTimeout(function () { z.className = z.className.replace("reveal", ""); }, 3000);
  }
  foundMessage() {
    var x = document.getElementById("foundMessage");
    x.className = "display";
    setTimeout(function () { x.className = x.className.replace("display", ""); }, 3000);
  }
  combineMessage() {
    var s = document.getElementById("successMessage");
    s.className = "display";
    setTimeout(function () { s.className = s.className.replace("display", ""); }, 3000);
  }
  allowDropFunction(baseInteger: string): any {
    return (dragData: any) => this.Reaction_Components1.length <= 1;
  }
  addToReactionComponents1($event: any) {
    let newMaterial: Material = $event.dragData;
    for (let indx in this.Reaction_Components1) {
      let myMaterial: Material = this.Reaction_Components1[indx];
      if (myMaterial.name === newMaterial.name) {
        return;
      }
    }

    this.Reaction_Components1.push({
      name: newMaterial.name,
      definition: newMaterial.definition,
      isStartingMaterial: newMaterial.isStartingMaterial,
      isFinalMaterial: newMaterial.isFinalMaterial,
      img: newMaterial.img,
      id: newMaterial.id
    })
    this.Reaction_Components1.sort((a: Material, b: Material) => {
      return a.name.localeCompare(b.name);
    });
  }
  goToProfilePage() {
    this.navCtrl.push(SigninPage, this.myLab);
  }
  showDoneButton() {
      var x = document.getElementById("submitButton");
      var y = document.getElementById("redoButton");
      // For RESETTING LAB this.myLab.isFinished = false;

      if (this.myLab.isFinished) {
          x.style.display = "block";
          y.style.display = "block";
      } else {
          x.style.display = "none";
          y.style.display = "none";
      }
  }
  redoLab() {
    this.existingIsFoundMaterials = [];
    this.myUserIsFoundIds = [];
    this.getMyMaterials().forEach((material) => {
      if (material.isStartingMaterial) {
        this.existingIsFoundMaterials.push(material);
        this.myUserIsFoundIds.push(material.id);
      }
    });
  }
  preRedo(material: Material) {
    let alert = this.alertCtrl.create({
      title: 'Confirm redo',
      message: 'Are you sure you want to reset this lab?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Redo',
          handler: () => {
            this.myLab.isFinished = false;
            this.redoLab();
            this.labService.updateLab(this.myLab);
          }
        }
      ]
    });
    alert.present();
  }
}