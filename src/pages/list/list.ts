import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../app/models/material';
import { CombinationService } from '../../services/combination.service';
import { CombinationsPage } from '../combinations/combinations';
import { ActionSheetController } from 'ionic-angular'
import { LabService } from '../../services/lab.service'
import { Lab } from '../../app/models/lab';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage{
  newMaterial: Material = {
    name: "",
    isFinalMaterial: false,
    isStartingMaterial: false,
    definition: "",
    img: "",
  }
  myLabId: String;
  myLab: Lab;
  constructor(private labService: LabService, public actionSheetCtrl: ActionSheetController, private comboService: CombinationService, private materialService: MaterialService, public navCtrl: NavController, public navParams: NavParams) {
    this.myLabId = this.navParams.data.id;
    this.myLab = this.labService.getLabs().find((newLab) => {
      return (newLab.id === this.myLabId);
    });
    this.myLab.materialsIDs = [];
  }
  
  goToCombinationsPage() {
    console.log(this.myLab);
    this.navCtrl.push(CombinationsPage, this.myLab);
  }
  
  onSubmit() {
    if(!(this.newMaterial.isStartingMaterial && this.newMaterial.isFinalMaterial) && this.newMaterial.name != "" && this.newMaterial.definition != "" && this.newMaterial.img != "") {
      let ref = this.materialService.addMaterial(this.newMaterial);
      ref.then(c => { this.myLab.materialsIDs.push(c.id)
        this.updateLab(this.myLab);
        console.log(this.myLab.materialsIDs);
      });
      
    }
    else {
      // ~~ERROR~~ need to change if statement, doesn't work if the firnla -- me editing later: (summer 2018) mby its final???? --  one is put in before the first one. As they type into fields, the fields should be updating. (two way data binding)
      alert('Field input is incorrect. Remember: a material cannot be both a final and starting material');
    }
    this.clearState();
  }
  
  clearState() {
    this.newMaterial.name = "";
    this.newMaterial.definition = "";
    this.newMaterial.img = "";
    this.newMaterial.isFinalMaterial = false;
    this.newMaterial.isStartingMaterial = false;
  }
  
  preDeleteMaterial($event, material: Material) { {
      let actionSheet = this.actionSheetCtrl.create({
        title: `Modify ${material.name}`,
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
    this.materialService.deleteMaterial(material);
    let materialIndex =  this.myLab.materialsIDs.indexOf(material.id);
    this.myLab.materialsIDs.splice(materialIndex, 1);
    this.updateLab(this.myLab);
    console.log(this.myLab.materialsIDs);
  }
  updateLab(lab: Lab) {
    this.labService.updateLab(lab);
  }
  updateMaterial(material: Material) {
    this.materialService.updateMaterial(material);
  }
}