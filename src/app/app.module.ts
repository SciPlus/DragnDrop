import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TaliaPage} from '../pages/talia/talia';
import { SubmitPage} from '../pages/submit/submit';
import { LoginPage} from '../pages/login/login';
import { RegisterPage} from '../pages/register/register';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {DndModule} from 'ng2-dnd';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

const firebaseAuth = {
  apiKey: "AIzaSyDj470IyOp2EyQi0sg-uu5kgobt2u8_t00",
  authDomain: "drag-and-drop-page-1.firebaseapp.com",
  databaseURL: "https://drag-and-drop-page-1.firebaseio.com",
  projectId: "drag-and-drop-page-1",
  storageBucket: "drag-and-drop-page-1.appspot.com",
  messagingSenderId: "205787615833"
};
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    TaliaPage,
    SubmitPage,
    LoginPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    DndModule.forRoot(),
    AngularFireModule.initializeApp(firebaseAuth),
    AngularFireAuthModule

    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    TaliaPage,
    SubmitPage,
    LoginPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
