import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { SigninPage } from '../signin/signin';
import { User } from '../../app/models/user';
import { UserService } from '../../services/user.service';
import { ProfilePage } from '../profile/profile';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  newUser: User = {
    id: "",
    userName: "",
    // do I need to add myLabs here or not?? --> probs not
  };
  users: User[];
  userId: any;
  myUser: User;
	@ViewChild('username') user;
  @ViewChild('password') password;

  constructor(private userService: UserService, private alertCtrl: AlertController, private fire: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  alert(message: string) {
    this.alertCtrl.create({
      title: 'Info!',
      subTitle: message,
      buttons: ['OK']
    }).present();
  }

  registerUser() {
    this.fire.auth.createUserWithEmailAndPassword(this.user.value, this.password.value)
    .then(data => {
      this.newUser.userName = this.user.value;
      this.newUser.id = this.userId;
      this.userService.addUser(this.newUser); // connecting user service to new registered user
      console.log('got the data ', data);
      this.alert('Registered!');
      // after registering, the id should be passed to the newUSer that is created  (the current user id that is)

      this.userId = this.fire.auth.currentUser.uid;
      this.users = this.userService.getUsers(); // getting users in database 
      this.getCurrentUser(this.userId);

      this.navCtrl.push(ProfilePage, this.myUser);
    })
    .catch(error => {
      console.log('got an error ', error);
      this.alert(error.message);
    });
  	console.log('Would register user with ', this.user.value, this.password.value);
  }
  goToSignIn() {
    this.navCtrl.push(SigninPage);
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