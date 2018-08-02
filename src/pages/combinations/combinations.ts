import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../app/models/material';
import { CombinationService } from '../../services/combination.service';
import { Combo } from '../../app/models/combo';
import { Subject } from 'rxjs/Subject'
import { IndivLabPage } from '../indivlab/indivlab';
import { Lab } from '../../app/models/lab';
import { LabService } from '../../services/lab.service';
import { ActionSheetController } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'page-combinations',
  templateUrl: 'combinations.html'
})
export class CombinationsPage{
  materials: Material[] = [];
  startAt = new Subject();
  endAt = new Subject();
  material: Material = {
    name: '',
    definition: '',
    isStartingMaterial: false,
    isFinalMaterial: false,
    img: ''

  }
  editState: boolean = false;
  combinationToEdit:Combo = {
    id: "",
    ingredients: [{}, {}],
    result: {}
  }
  combo: Combo = {};
  combinations: Combo[] = [];
  preComponents: Material[] = [];
  postComponents: Material[] = [];
  query: string = "";
  tempMaterials: Material[] = [];
  newCombo: Combo = {};
  myLabId: String;
  myLab: Lab;
  myLabCombos: Material[];
  constructor(public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, private labService: LabService, private comboService: CombinationService, private materialService: MaterialService, public navCtrl: NavController, public navParams: NavParams) {
    this.myLab = this.navParams.data;
    this.myLab.combinationsIDs = this.navParams.data.combinationsIDs;
    this.myLabCombos = this.comboService.getCombos(this.navParams.data.combinationsIDs);
    console.log(` constructor(): ${this.myLabCombos}`);
  }
    // Let's populate this page with some filler content for funzies
  // test this tomorrow --> then move on to play page organization (w/ grid)
  // then start saving labs, sharing labs, and creating a search page
  // then work on the sign out page/grading system.
  presentConfirm(combo: Combo) {
    let alert = this.alertCtrl.create({
      title: 'Confirm deletion',
      message: 'Are you sure you want to delete this combination?',
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
            this.deleteCombination(combo);
            let delIndex = this.myLab.combinationsIDs.indexOf(combo.id);
            this.myLab.combinationsIDs.slice(delIndex, delIndex+1);

          }
        }
      ]
    });
    alert.present();
  }
  getMyMaterials() {
    return this.materialService.getMaterials(this.myLab.materialsIDs);
  }
  getMyCombos() {
    return this.comboService.getCombos(this.myLab.combinationsIDs);
  }
  createCombination(preComponents, postComponents) {
    this.newCombo.ingredients = [{
      id: preComponents[0].id,
      name: preComponents[0].name
    }, {
      id: preComponents[1].id,
      name: preComponents[1].name
    }]
    this.newCombo.result = {
      id: postComponents[0].id,
      name: postComponents[0].name
    };
    let ref = this.comboService.addCombo(this.newCombo);
      ref.then(c => { this.myLab.combinationsIDs.push(c.id);
        this.labService.updateLab(this.myLab);
      });
    this.newCombo = {};
    // add new combination to combos w/ ingredietns - precomp and result: post-comp ... push to databse.
  }
  refresh() {
    this.preComponents = [];
    this.postComponents = [];
  }
  inputSearch(query) {
    this.materials = this.materialService.getMaterials(this.myLab.materialsIDs);
    let queryText = query.target.value;
    if (queryText && queryText.trim() != ' ')  {
      this.materials = this.materials.filter((newMaterial) => {
        return (newMaterial.name.toLowerCase().indexOf(queryText.toLowerCase()) > -1 );
      }
    )};
    if (queryText === "") {
      this.materialService.getMaterials(this.myLab.materialsIDs);
    }
  }
  addToPreComponents($event: any) {
    let newComponent: Material = $event.dragData;
    this.preComponents.push(newComponent);
    this.preComponents.sort((a: Material, b: Material) => {
      return a.name.localeCompare(b.name);
    });
  }
  addToPostComponents($event: any) {
    let newComponent: Material = $event.dragData;
    this.postComponents.push(newComponent);
    this.postComponents.sort((a: Material, b: Material) => {
      return a.name.localeCompare(b.name);
    });
  }
  allowDropFunction1(): any {
    return (dragData: any) => this.preComponents.length <= 2;
  }
  allowDropFunction2(): any {
    return (dragData: any) => this.postComponents.length <= 1;
  }
  deleteCombination(combo: Combo) {
    this.comboService.deleteCombo(combo);
    let comboIndex =  this.myLab.combinationsIDs.indexOf(combo.id);
    this.myLab.combinationsIDs.splice(comboIndex, comboIndex+1);
    this.labService.updateLab(this.myLab);
  }
  goToIndivLabPage() {
    this.navCtrl.push(IndivLabPage, this.myLab);
  }
  preDeleteCombo(combo: Combo) { {
    let actionSheet = this.actionSheetCtrl.create({
      title: `Modify: ${combo.ingredients[0].name} + ${combo.ingredients[1].name} = ${combo.result.name}`,
      buttons: [
        {
          text: `Delete combination`,
          role: 'destructive',
          handler: () => {
            this.presentConfirm(combo);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
}