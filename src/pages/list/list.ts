import { Component , ViewChild} from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../app/models/material';
import { CombinationService } from '../../services/combination.service';
import { CombinationsPage } from '../combinations/combinations';
import { ActionSheetController } from 'ionic-angular';
import { LabService } from '../../services/lab.service';
import { Lab } from '../../app/models/lab';
import { PopoverController } from 'ionic-angular';
import { PopoverComponent } from '../../components/popover/popover';

import { User } from '../../app/models/user';
import { UserService } from '../../services/user.service';

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
  myLab: Lab;
  materialState: String = "";
  materialShow: String = "Starting Material";
  myUser: User;
  myUserIsFoundIds: String[];

  constructor(private userService: UserService, public popoverCtrl: PopoverController, public alertCtrl: AlertController, private labService: LabService, public actionSheetCtrl: ActionSheetController, private comboService: CombinationService, private materialService: MaterialService, public navCtrl: NavController, public navParams: NavParams) {
    this.myLab = this.navParams.data.data1; // lab from lab db
    this.myUser = this.navParams.data.data2;
    this.myUserIsFoundIds = this.userService.getUserIsFoundIds(this.myUser.userId, this.myLab.id);
    this.myLab.materialsIDs = this.labService.getMaterialIds(this.myLab);
  }
  getMyMaterials() {
    return this.materialService.getMaterials(this.myLab.materialsIDs);
  }
  goToCombinationsPage() {
    this.navCtrl.push(CombinationsPage, {data1: this.myLab, data2: this.myUser}); // lab from lab db
  }
  getTypeOfMaterial(newMaterial: Material, materialState: String) {
    if (materialState == "Starting Material") {
      newMaterial.isStartingMaterial = true;
      newMaterial.isFinalMaterial = false;

    } else if (materialState == "Final Material") {
      newMaterial.isFinalMaterial = true;
      newMaterial.isStartingMaterial = false;

    } else {
      newMaterial.isStartingMaterial = false;
      newMaterial.isFinalMaterial = false;
    }
  }
  onSubmit(newMaterial) {
    this.getTypeOfMaterial(newMaterial, this.materialState);
    if(!(newMaterial.isStartingMaterial && newMaterial.isFinalMaterial) && (newMaterial.name != "") && (newMaterial.img != "")) { // definition does not have to be complete
      let ref1 = this.materialService.addMaterial(newMaterial);
      if (newMaterial.isStartingMaterial) {
        ref1.then(d => {
          this.myUser.myLabs.find((lab => lab.labId == this.myLab.id)).isFoundIds.push(d.id);
          this.userService.updateUser(this.myUser);
          this.myUserIsFoundIds.push(d.id);
        });
      }
      ref1.then(c => {
        this.myLab.materialsIDs.push(c.id);
        this.updateLab(this.myLab);
        this.getMyMaterials();
      });
    }
    else {
      // ~~ERROR~~ need to change if statement, doesn't work if the firnla -- me editing later: (summer 2018) mby its final???? --  one is put in before the first one. As they type into fields, the fields should be updating. (two way data binding)
      alert("Name, image, and state of material must be entered prior to addition of a new material.");
    }
    this.clearState();
    this.iconSelectedCheck();
  }
  
  clearState() {
    this.newMaterial.name = "";
    this.newMaterial.definition = "";
    this.newMaterial.img = "";
    this.newMaterial.isFinalMaterial = false;
    this.newMaterial.isStartingMaterial = false;

  }
  presentConfirm(material: Material) {
    let alert = this.alertCtrl.create({
      title: 'Confirm deletion',
      message: 'Are you sure you want to delete this material?',
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
            this.deleteMaterial(material);

          }
        }
      ]
    });
    alert.present();
  }
  preDeleteMaterial( material: Material) { {
      let actionSheet = this.actionSheetCtrl.create({
        title: `Modify ${material.name}`,
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.presentConfirm(material);
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
  deleteMaterial(material: Material) {
    // delete individual material
    let materialIndex =  this.myLab.materialsIDs.indexOf(material.id);
    this.myLab.materialsIDs.splice(materialIndex, materialIndex+1);
    this.labService.updateLab(this.myLab);
    // get combinations
    let combos = this.comboService.getCombos(this.myLab.combinationsIDs);
    // check which combinations use material
    combos.forEach(combo => {
      if ((combo.ingredients[0].id == material.id) || (combo.ingredients[1].id == material.id) || (combo.result.id== material.id)) {
        // delete individual combination
        let comboIndex = this.myLab.combinationsIDs.indexOf(combo.id);
        this.myLab.combinationsIDs.splice(comboIndex, comboIndex+1);
        this.comboService.deleteCombo(combo);
        // get materials in combination
        // - get materials
        let materials = this.materialService.getMaterials(this.myLab.materialsIDs); // should not include original material
        console.log("New Materials Hopefully Does Not Include 1: " + materials);

        // - get other materials materials
        let material1 = combo.ingredients[0];
        let material2 = combo.ingredients[1];
        let material3 = combo.result;

        // call function again if not equal to original material
        if (material1 != material) { // should I do .id for both?? (later)
         this.deleteMaterial(material1);
        }
        if (material2 != material) {
         this.deleteMaterial(material2);
        }
        if (material3 != material) {
         this.deleteMaterial(material3);
        }
      }
    });
    }

    // delete further combinations
  updateLab(lab: Lab) {
    this.labService.updateLab(lab);
  }
  updateMaterial(material: Material) {
    this.materialService.updateMaterial(material);
  }
  iconSelectedCheck() {
    var x = document.getElementById("addIconButton");
      if (this.newMaterial.img != "") {
        x.style.opacity = "0.3";
      } else {
        x.style.opacity = "1.0";
      }
  }
  change(newMaterial) {
    console.log("New Material Beg.");
    console.log(newMaterial.img);
    console.log("New Material End");
  }
  presentPopover() {
    const popover = this.popoverCtrl.create(PopoverComponent);
    popover.present();
    popover.onDidDismiss(data => {
      if (data != null) {
        this.newMaterial.img = data.url;
        console.log(this.newMaterial.img);
        console.log(this.newMaterial);
        this.iconSelectedCheck();
      }
    })
  }
  nextChecking() {
    // check if there are three materials total (at least)
    // make sure there is only one final material
  }
}