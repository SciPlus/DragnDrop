import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { User } from '../../src/app/models/user';

@Injectable()
export class UserService {
    existingUsers: User[] = [];
    usersCollection: AngularFirestoreCollection<User>    
    userDoc: AngularFirestoreDocument<User>;

    constructor(public afs: AngularFirestore) {
        let users: Observable<User[]>;
        this.usersCollection = this.afs.collection('users', ref => ref.orderBy('userName', 'asc'));
        // this.materials = this.afs.collection('materials').valueChanges();
        users = this.usersCollection.snapshotChanges().map(changes => {
            // in addition the other properties of the materials, I am getting their auto-ids.
            return changes.map(action => {
                const data = action.payload.doc.data() as User;
                data.id = action.payload.doc.id;
                return data;
            })
        });
        users.subscribe(users => {
            this.existingUsers = users;
        });
    };
    getUsers() {
        return this.existingUsers;
    }
    // change these two functions later today because they do not actually fetch anything from the database. --> done
    getUserLabIds(user: User) {
        let x = this.existingUsers.find(exUser => exUser.userId == user.userId);
        return x.labIds;
    }
    getUserName(user: User) {
        let x = this.existingUsers.find(exUser => exUser.userId == user.userId);
        return x.userName;

    }
    addUser(user: User) {
         return this.usersCollection.add(user);
    }
    deleteUser(user: User) {
        this.userDoc = this.afs.doc(`users/${user.id}`);
        this.userDoc.delete();
    }
    updateUser(user: User) {
        this.userDoc = this.afs.doc(`users/${user.id}`);
        this.userDoc.update(user);
    }
};