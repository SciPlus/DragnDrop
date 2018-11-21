import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { GamePage } from '../game/game';
import { RegisterPage } from '../register/register';
import { ProfilePage } from '../profile/profile';
import { listenToElementOutputs } from '@angular/core/src/view/element';
import { UserService } from '../../services/user.service';
import { User } from '../../app/models/user';


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

  users: User[];
  userId: string;
  myUser: User;
  constructor(private userService: UserService, private alertCtrl: AlertController, private fire:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
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
      // getting users in database

      this.userId = this.fire.auth.currentUser.uid;
      this.users = this.userService.getUsers(); // get useres doesnt work

      this.getCurrentUser(this.userId);

      this.navCtrl.push(ProfilePage, this.myUser);

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
  getCurrentUser(myUserId: String) {
    // search through users --> find user that has id that matches userId
    this.users.forEach(user => {
      if (user.userId == myUserId) {
        this.myUser = user;
      }

    })
  }
}