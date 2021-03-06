import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { GamePage } from '../game/game';
import { ListPage } from '../list/list';
import { AngularFireAuth } from 'angularfire2/auth';
import { Lab } from '../../app/models/lab';

import { User } from '../../app/models/user';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'page-indivlab',
  templateUrl: 'indivlab.html'
})
export class IndivLabPage {
    email: string;
    myLab: Lab;
    playReplay: String;
    myUser: User;
    myUserIsFoundIds: String[]; // to pass to game page ( must collect data first here )
  constructor(private userService: UserService, private fire: AngularFireAuth, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.email = fire.auth.currentUser.email;
    this.myLab = this.navParams.data.data1; // lab from lab db
    this.myUser = this.navParams.data.data2;
    console.log("my Lab on this page (name) : " + this.myLab.name);
    this.myUserIsFoundIds = this.userService.getUserIsFoundIds(this.myUser.userId, this.myLab.id);
    console.log("this.myUser on indiv page " + this.userService.getUserIsFoundIds(this.myUser.userId, this.myLab.id));

  };

  edit() {
    this.navCtrl.push(ListPage, {data1: this.myLab, data2: this.myUser}); // lab from lab db
  }
  play() {
    this.navCtrl.push(GamePage, {data1: this.myLab, data2: this.myUser, data3: this.userService.getUserIsFoundIds(this.myUser.userId, this.myLab.id)}); // lab from lab db
  }
}