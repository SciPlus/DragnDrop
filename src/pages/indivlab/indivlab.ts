import { Component , ViewChild} from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { DragulaModule } from '../../../node_modules/ng2-dragula/ng2-dragula';
import { SigninPage } from '../signin/signin';
import { RegisterPage } from '../register/register';
import { TaliaPage } from '../talia/talia';
import { ListPage } from '../list/list';
import { AngularFireAuth } from 'angularfire2/auth';
import { Lab } from '../../app/models/lab';
import { LabService } from '../../services/lab.service';
import { ProfilePage } from '../profile/profile';



@Component({
  selector: 'page-indivlab',
  templateUrl: 'indivlab.html'
})
export class IndivLabPage {
    email: string;
    myLabId: String;
    myLab: Lab = {
      name: "",
      originalCreator: "",
      combinationsIDs: [],
      materialsIDs: [],
    }

  constructor(private labService: LabService, private fire: AngularFireAuth, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.email = fire.auth.currentUser.email;

    this.myLabId = this.navParams.data.id;
    this.myLab = this.labService.getLabs().find((newLab) => {
      return (newLab.id === this.myLabId);
    })
    // will integrate this as a part of Ionic Navigator to make sure lab id is passed through ionic navCtrl correctly.
  };

  edit(lab) {
    this.navCtrl.push(ListPage, lab);
  }
  play(lab) {
    this.navCtrl.push(TaliaPage, lab);
  }
}