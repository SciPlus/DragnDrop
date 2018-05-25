import { Component , ViewChild} from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { IndivLabPage } from '../indivlab/indivlab';
import { Lab } from '../../app/models/lab';
import { LabService } from '../../services/lab.service'

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
    email: string;
    labs: Array<Lab> = [];
    newLab: Lab = {
      name: "",
      originalCreator: "",
      combinations: [],
      materials: [],
    }
    userId: any;
    labUser: string = "";
  
  constructor(private labService: LabService, private fire: AngularFireAuth, public navCtrl: NavController, public alertCtrl: AlertController) {
    this.email = this.fire.auth.currentUser.email;
    this.userId = this.fire.auth.currentUser.uid;
  };
  deleteLab(lab: Lab) {
    this.labService.deleteLab(lab);
  }
  goToIndivLabPage() {
    this.navCtrl.push(IndivLabPage);
  }
  onSubmit() {
    this.newLab.originalCreator = this.userId; // assigning the id to original Creator
    this.newLab.combinations = [];
    this.newLab.materials = [];
    this.labService.addLab(this.newLab);
    if(this.newLab.name != "" && this.newLab.originalCreator != "") {
      this.newLab.name = "";
      this.newLab.combinations = [];
      this.newLab.materials = [];
      this.newLab.originalCreator = "";
    }
    else {
      // ~~ERROR~~ need to change if statement, doesn't work if the firnla one is put in before the first one. As they type into fields, the fields should be updating. (two way data binding)
      alert('Field input is incorrect. Remember: a material cannot be both a final and starting material');
      this.newLab.name = "";
      this.newLab.originalCreator = "";
      this.newLab.combinations = [];
      this.newLab.materials = [];
    }
  }
  add() {
    this.labs.push(this.newLab);
    // here I need to input all fields for the lab;
        // lab.originalCreator = currentUser;
        // lab.combinations = empty; (getCombos - when you get there)
        // lab.materials = empty; (getMaterials - when you get there)
        // ngModel lab.name to the name input field
  }
}