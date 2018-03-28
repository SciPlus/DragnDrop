import { Component , ViewChild} from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DragulaModule } from '../../../node_modules/ng2-dragula/ng2-dragula';
import { SigninPage } from '../signin/signin';
import { RegisterPage } from '../register/register';
import { TaliaPage } from '../talia/talia';
import { ListPage } from '../list/list';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-indivlab',
  templateUrl: 'indivlab.html'
})
export class IndivLabPage {
    email: string;
    labs: Array<string> = [];
    newLab: string = "";
  
  constructor(private fire: AngularFireAuth, public navCtrl: NavController, public alertCtrl: AlertController) {
    this.email = fire.auth.currentUser.email;

  };
  edit() {
    this.navCtrl.push(ListPage)
  }
  play() {
    this.navCtrl.push(TaliaPage);
  }
}