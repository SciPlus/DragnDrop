import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { GamePage } from '../game/game';
import { ListPage } from '../list/list';
import { AngularFireAuth } from 'angularfire2/auth';
import { Lab } from '../../app/models/lab';
import { LabService } from '../../services/lab.service';



@Component({
  selector: 'page-indivlab',
  templateUrl: 'indivlab.html'
})
export class IndivLabPage {
    email: string;
    myLabId: String;
    myLab: Lab;
    playReplay: String;
  constructor(private labService: LabService, private fire: AngularFireAuth, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.email = fire.auth.currentUser.email;
    this.myLab = this.navParams.data;
  };

  edit(lab) {
    this.navCtrl.push(ListPage, lab);
  }
  play(lab) {
    this.navCtrl.push(GamePage, lab);
  }
}