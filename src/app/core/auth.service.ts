import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';


interface User {
    uid: string;
    email: string;
    photoURL?: string;
    name?: string;
    role?: string;
  }

@Injectable() 
export class AuthService {
    user: Observable<User>;
    constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {

        this.user = this.afAuth.authState
        .switchMap(user => {
            if (user) {
                return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
            }
            else {
                return Observable.of(null);
            }
        })
    }
    // method for google sign in 
    googleSignIn() {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.oAuthLogin(provider);
    }
    private oAuthLogin(provider) {
        return this.afAuth.auth.signInWithPopup(provider)
        .then((credential) => {
            this.updateUserData(credential.user);
        })
    }
    private updateUserData(user) {
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

        const data: User = {
            uid: user.uid,
            email: user.email,
            name: user.name,
            photoURL: user.photoURL
        }
        return userRef; // save/set data
    }
}