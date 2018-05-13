import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TaliaPage } from '../../pages/talia/talia';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../app/models/material';
import { CombinationService } from '../../services/combination.service';
import { Combo } from '../../app/models/combo';
import { CombinationsPage } from '../combinations/combinations';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit{
  createdProducts: Array<Material>;
  materials: Material[];
  material: Material = {
    name: '',
    definition: '',
    isStartingMaterial: false,
    isFinalMaterial: false,
    img: ''

  }
  editState: boolean = false;
  materialToEdit:Material = {
    name: '',
    definition: '',
    isStartingMaterial: false,
    isFinalMaterial: false,
    img: ''

  }
  combinations: Combo[];


  constructor(private comboService: CombinationService, private materialService: MaterialService, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    }
    // Let's populate this page with some filler content for funzies

  ngOnInit() {
    // getting materials from database (calling getMaterials function)
    this.materials = this.materialService.getMaterials();
    this.combinations = this.comboService.getCombos();
        // setting our materials to the materials in the database
        // I wonder if there is a way to sort these materials in starting materials and so on based on properties of theirs. Maybe, according to the 3rd video of firebase database, I'll watch it.
  }
  goToCombinationsPage() {
    this.navCtrl.push(CombinationsPage);
  }
  onSubmit() {
    if(!(this.material.isStartingMaterial && this.material.isFinalMaterial) && this.material.name != "" && this.material.definition != "" && this.material.img != "") {
      console.log(this.material.isStartingMaterial);
      this.materialService.addMaterial(this.material);
      this.material.name = "";
      this.material.definition = "";
      this.material.img = "";
      this.material.isFinalMaterial = false;
      this.material.isStartingMaterial = false;
      this.material.isFound = null;
    }
    else {
      // ~~ERROR~~ need to change if statement, doesn't work if the firnla one is put in before the first one. As they type into fields, the fields should be updating. (two way data binding)
      alert('Field input is incorrect. Remember: a material cannot be both a final and starting material');
      this.material.name = "";
      this.material.definition = "";
      this.material.img = "";
      this.material.isFinalMaterial = false;
      this.material.isStartingMaterial = false;
    }
  }
  deleteMaterial(event, material: Material) {
    this.clearState();
    this.materialService.deleteMaterial(material);
  }
  editMaterial(event, material: Material) {
    this.editState = true;
    this.materialToEdit = material;
  }
  clearState() {
    this.editState = false;
    this.materialToEdit = null;
  }
  updateMaterial(material: Material) {
    this.materialService.updateMaterial(material);
    this.clearState();
  }
}

// 
// make "" not be able to be submitted to add to newCurrentMaterials
// show goal material under current matierials
// show product formed underneath reactants.
// completion toast
// failure toast

// on this page, lets use the databse to submit new items to available products.
