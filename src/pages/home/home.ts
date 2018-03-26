import { Component , ViewChild} from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DragulaModule } from '../../../node_modules/ng2-dragula/ng2-dragula';
import { SigninPage } from '../signin/signin';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('username') uname;
  @ViewChild('password') password;
  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
  };
  signIn() {
  	this.navCtrl.push(SigninPage);
  }

  register() {
  	this.navCtrl.push(RegisterPage);
  }
}
