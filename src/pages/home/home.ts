import { Component , ViewChild} from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DragulaModule } from '../../../node_modules/ng2-dragula/ng2-dragula';
import { SigninPage } from '../signin/signin';
import { RegisterPage } from '../register/register';
import { CombinationService } from '../../services/combination.service';
import { MaterialService } from '../../services/material.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('username') uname;
  @ViewChild('password') password;
  
  constructor(private combinationService: CombinationService, private materialService: MaterialService, public navCtrl: NavController, public alertCtrl: AlertController) {
  
  };
  signIn() {
  	this.navCtrl.push(SigninPage);
  }

  register() {
  	this.navCtrl.push(RegisterPage);
  }
}