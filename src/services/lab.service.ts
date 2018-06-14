import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Lab } from '../../src/app/models/lab';

@Injectable()
export class LabService {
    labs: Lab[] = [];
    existingLabs: Lab[] = [];
    labsCollection: AngularFirestoreCollection<Lab>    
    labDoc: AngularFirestoreDocument<Lab>;
    myLabIds: String[];
    constructor(public afs: AngularFirestore) {
        let labs: Observable<Lab[]>;
        this.labsCollection = this.afs.collection('labs', ref => ref.orderBy('name', 'asc'));
        // this.materials = this.afs.collection('materials').valueChanges();
        labs = this.labsCollection.snapshotChanges().map(changes => {
            // in addition the other properties of the materials, I am getting their auto-ids.
            return changes.map(action => {
                const data = action.payload.doc.data() as Lab;
                data.id = action.payload.doc.id;
                return data;
            })
        });
        labs.subscribe(labs => {
            this.existingLabs = labs;
        })
    };
    getLabs() {
        return this.existingLabs;
    }
    addLab(lab: Lab) {
        return this.labsCollection.add(lab);
    }
    deleteLab(lab: Lab) {
        this.labDoc = this.afs.doc(`labs/${lab.id}`);
        this.labDoc.delete();
    }
    updateLab(lab: Lab) {
        this.labDoc = this.afs.doc(`labs/${lab.id}`);
        this.labDoc.update(lab);
    }
};