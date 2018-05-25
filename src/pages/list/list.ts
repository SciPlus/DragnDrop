import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TaliaPage } from '../../pages/talia/talia';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../app/models/material';
import { CombinationService } from '../../services/combination.service';
import { Combo } from '../../app/models/combo';
import { CombinationsPage } from '../combinations/combinations';
import { ActionSheetController } from 'ionic-angular'

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage{
  createdProducts: Array<Material>;
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


  constructor(public actionSheetCtrl: ActionSheetController, private comboService: CombinationService, private materialService: MaterialService, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    }
    // Let's populate this page with some filler content for funzies
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
  preDeleteMaterial($event, material) { {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Modify your material',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.deleteMaterial($event, material);
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
