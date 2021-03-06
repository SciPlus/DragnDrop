import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { GamePage} from '../pages/game/game';
import { SubmitPage} from '../pages/submit/submit';
import { SigninPage} from '../pages/signin/signin';
import { RegisterPage} from '../pages/register/register';
import { ProfilePage} from '../pages/profile/profile';
import { IndivLabPage } from '../pages/indivlab/indivlab';
import { CombinationsPage} from '../pages/combinations/combinations';
import { PopoverComponent} from '../components/popover/popover';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DndModule } from 'ng2-dnd';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MaterialService } from '../services/material.service';
import { UserService } from '../services/user.service';
import { CombinationService} from '../services/combination.service';
import { LabService } from '../services/lab.service';

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
    GamePage,
    SubmitPage,
    SigninPage,
    RegisterPage,
    ProfilePage,
    IndivLabPage,
    CombinationsPage,
    PopoverComponent,
  ],
  imports: [ 
    FormsModule, 
    BrowserModule,
    IonicModule.forRoot(MyApp),
    DndModule.forRoot(),
    AngularFireModule.initializeApp(firebaseAuth),
    AngularFireAuthModule,
    AngularFirestoreModule,
    
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    GamePage,
    SubmitPage,
    SigninPage,
    RegisterPage,
    ProfilePage,
    IndivLabPage,
    CombinationsPage,
    PopoverComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MaterialService,
    CombinationService,
    LabService,
    UserService
  ]
})
export class AppModule {}
