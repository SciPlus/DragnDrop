import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Tab } from 'ionic-angular/components/tabs/tab';
import { GamePage } from '../game/game';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-submit',
  templateUrl: 'submit.html',
})
export class SubmitPage {
    score: any = {
        remark:  "",
        grade: 0
    }
    elementsFound: number = 0;
    totalElements: number = 10;
    constructor(private fire: AngularFireAuth, public navCtrl: NavController) {
        this.determineScore();
        // how can I access elements form the Game Page here, such that I can access the score or elementsfound.
    };
    determineScore() {
        if (this.elementsFound >= this.totalElements - 2) {
            this.score.grade = 100;
            this.score.remark = "excellent";
        }
        else if (this.elementsFound >= this.elementsFound/2) {
            this.score.grade = 50;
            this.score.remark = "fair";
        }
        else if (this.elementsFound >= this.elementsFound/4) {
            this.score.grade = 25;
            this.score.remark = "needs improvement";
        }
        else {
            this.score.grade = 0;
            this.score.remark = "incomplete";
        }
    }
    signOut() {
        this.fire.auth.signOut();
        console.log("signed out");
        this.navCtrl.push(HomePage);
    }
}