import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { GamePage } from '../game/game';
import { RegisterPage } from '../register/register';
import { ProfilePage } from '../profile/profile';
import { listenToElementOutputs } from '@angular/core/src/view/element';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

	@ViewChild('username') user;
  @ViewChild('password') password;
  ListOfWords: String = "";
  text: any;
  numbers: any = [1, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 19, 21, 22, 23, 25, 29, 31, 33, 35, 37, 39, 47, 53, 56, 59, 63, 65, 69, 70, 71,73, 73, 75, 77, 87, 89, 91, 92, 93, 94, 95, 97, 99, 110, 111, 119];

  constructor(private alertCtrl: AlertController, private fire:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.numbers.length);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signin');
  }

  alert(message: string) {
    this.alertCtrl.create({
      title: 'Hey User!',
      subTitle: message,
      buttons: ['OK']
    }).present();
  }

  signInUser() {
    this.fire.auth.signInWithEmailAndPassword(this.user.value, this.password.value)
    .then( data => {
      console.log('got data', this.fire.auth.currentUser);
      this.alert(`@${this.fire.auth.currentUser.email}, you are all logged in!`);
        this.navCtrl.push( ProfilePage );
      // user is logged in
    })
    .catch( error => {
      console.log('got an error', error);
      this.alert(error.message);
    })
  	console.log('Would sign in with ', this.user.value, this.password.value);
  }
  goToRegister() {
    this.navCtrl.push(RegisterPage);
  }
  enterList() {
    let NewListOfWords = this.ListOfWords.split(" ");
    console.log(NewListOfWords);
  }
  clear() {
    this.ListOfWords= "";
  }
  resetPassword() {
    console.log("to be figured out later");
    alert("to be figured out later");
  }
}