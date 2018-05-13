// for a future update, maybe consider adding different mole ratios of substances to produce other substances. 
// for now, any number of the substances will combine.
// request for lab. 
// teacher 
// teacher in class 103, 103 is over
// institution makes 
// password for each period. 
// id/password --> access lab. Control for the teacher.
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Tab } from 'ionic-angular/components/tabs/tab';
import { DndModule } from 'ng2-dnd';
import { HomePage } from '../home/home';
import { SubmitPage } from '../submit/submit';
import { AngularFireAuth } from 'angularfire2/auth';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../app/models/Material';
import { CombinationService } from '../../services/combination.service';
import { Combo } from '../../app/models/combo';

@IonicPage()
@Component({
  selector: 'page-talia',
  templateUrl: 'talia.html',
})
export class TaliaPage implements OnInit {
  email: string;
  buttonClicked = false;
  ingred: Object;
  countOfComboElements: number = 0;
  addedItem: object = {};
  helperText1: string = "";
  helperText2: number = 0;
  newComboCreated: boolean = false;
  toDos: Array<any> = [{
    task: "Clean Room",
    duration: 30,
    definition: "thing that exists"
  },
  {
    task: "Go To Grocery Store",
    duration: 25,
    definition: "other that exists"

  }, {
    task: "Do Homework",
    duration: 45,
    definition: "other other thing that exists"

  }];
  countOfFoundElements: number = 0;
  materialToDefine: Material;
  defineState: boolean = false;
  material: Material = {
    name: '',
    definition: '',
    isStartingMaterial: false,
    isFinalMaterial: false,
    img: "",
    isFound: false
  }
  materials: Material[];
  Reaction_Components1: Material[] = []; /// setting to a value;
  combinations: Combo[];

  constructor(private combinationService: CombinationService, private materialService: MaterialService, private fire: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
    this.email = fire.auth.currentUser.email;
  }
  ngOnInit() {
    // getting materials from database (calling getMaterials function)
    this.materials = this.materialService.getMaterials();
    let rawCombinations = this.combinationService.getCombos();

    this.combinations = rawCombinations.map(rawCombination => {
      let newCombination = rawCombination;
      newCombination.result = this.materials.find(material => material.id == rawCombination.result)
      newCombination.ingredients = rawCombination.ingredients.map(materialId => this.materials.find(m => m.id === materialId))

      return newCombination;
    })
  }
  defineMaterial(event, material: Material) {
    this.defineState = true;
    this.materialToDefine = material;
  }
  clearState() {
    this.defineState = false;
    this.materialToDefine = null;
  }
  openSubmitPage() {
    this.navCtrl.push(SubmitPage);
  }
  findMaterial(myResult: string) {
    this.materials.forEach(element => {
      if (element.name === myResult) {
        element.isFound = true;
      }
    });
  }
  checkCombo() { // checks if elements form combo

    if (this.Reaction_Components1.length >= 2) {
      this.combinations.forEach(combo => {
        if (((this.Reaction_Components1[0].name === combo.ingredients[0].name) || (this.Reaction_Components1[0].name === combo.ingredients[1].name)) && ((this.Reaction_Components1[1].name === combo.ingredients[0].name) || (this.Reaction_Components1[1].name === combo.ingredients[1].name))) {
          this.findMaterial(combo.result.name);
          if (combo.result.isFinalMaterial === true) {
            this.completionMessage();
          }
        }
      })
    }
  }
  clearComponents() {
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
    })
    this.Reaction_Components1.sort((a: Material, b: Material) => {
      return a.name.localeCompare(b.name);
    });
  }
  showInfo() {
    this.toDos.forEach(toDo => {
      console.log(toDo.task + " for " + toDo.duration + " mins");
    });
  }
  add() {
    this.toDos.push({ ...this.addedItem });
  }
  delete() {
    this.toDos.pop();
  } //
}