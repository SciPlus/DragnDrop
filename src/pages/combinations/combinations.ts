import { Component } from '@angular/core';
import { NavController, NavParams, DisplayWhen } from 'ionic-angular';
import { TaliaPage } from '../../pages/talia/talia';
import { ListPage } from '../../pages/list/list';
import { MaterialService } from '../../services/material.service';
import { DndModule } from 'ng2-dnd';
import { Material } from '../../app/models/material';
import { CombinationService } from '../../services/combination.service';
import { Combo } from '../../app/models/combo';
import { Subject } from 'rxjs/Subject'
import { CompileTemplateMetadata } from '@angular/compiler';
import { IndivLabPage } from '../indivlab/indivlab';

@Component({
  selector: 'page-combinations',
  templateUrl: 'combinations.html'
})
export class CombinationsPage{
  materials: Material[];
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

  constructor(private comboService: CombinationService, private materialService: MaterialService, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    }
    // Let's populate this page with some filler content for funzies
  // test this tomorrow --> then move on to play page organization (w/ grid)
  // then start saving labs, sharing labs, and creating a search page
  // then work on the sign out page/grading system.
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
    this.comboService.addCombo(this.newCombo);
    this.newCombo = {};
    // add new combination to combos w/ ingredietns - precomp and result: post-comp ... push to databse.
  }
  refresh() {
    this.preComponents = [];
    this.postComponents = [];
  }
  inputSearch(query) {
    let queryText = query.target.value;
    if (queryText && queryText.trim() != ' ')  {
      this.materials = this.materials.filter((newMaterial) => {
        return (newMaterial.name.toLowerCase().indexOf(queryText.toLowerCase()) > -1 );
      }
    )};
    if (queryText === "") {
      this.materialService.getMaterials();
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
  deleteCombination(event, combo: Combo) {
    this.clearState();
    this.comboService.deleteCombo(combo);
  }
  editCombinations(event, combo: Combo) {
    this.editState = true;
    this.combinationToEdit = combo;
  }
  clearState() {
    this.editState = false;
    this.combinationToEdit = null;
  }
  updateCombinations(combo: Combo) {
    this.materialService.updateMaterial(combo);
    this.clearState();
  }
  goToIndivLabPage() {
    this.navCtrl.push(IndivLabPage);
  }
}

// 
// make "" not be able to be submitted to add to newCurrentMaterials
// show goal material under current matierials
// show product formed underneath reactants.
// completion toast
// failure toast

// on this page, lets use the databse to submit new items to available products.
