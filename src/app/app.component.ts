import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TaliaPage } from '../pages/talia/talia';
import { CombinationsPage } from '../pages/combinations/combinations';
import { SubmitPage } from '../pages/submit/submit';
import { ProfilePage } from '../pages/profile/profile';
import { SigninPage } from '../pages/signin/signin';
import { RegisterPage } from '../pages/register/register';
import { IndivLabPage } from '../pages/indivlab/indivlab';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  @ViewChild(Nav) nav: Nav;

  rootPage: any = CombinationsPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'List', component: ListPage },
      { title: 'Talia', component: TaliaPage},
      { title: 'Submit', component: SubmitPage },
      { title: 'Profile', component: ProfilePage },
      { title: 'IndivLab', component: IndivLabPage },
      { title: 'Combinations', component: CombinationsPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
