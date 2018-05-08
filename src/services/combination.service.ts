import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Combo } from '../app/models/combo';
import { Observable } from 'rxjs/Observable'
@Injectable()
export class CombinationService {
    combosCollection: AngularFirestoreCollection<Combo>
    combos: Observable<Combo[]>;
    comboDoc: AngularFirestoreDocument<Combo>;
    constructor(public afs: AngularFirestore) {
        this.combosCollection = this.afs.collection('combinations', ref => ref.orderBy('result', 'asc'));
        // this.materials = this.afs.collection('materials').valueChanges();
        this.combos = this.combosCollection.snapshotChanges().map(changes => {
            // in addition the other properties of the materials, I am getting their auto-ids.
            return changes.map(action => {
                const data = action.payload.doc.data() as Combo;
                data.id = action.payload.doc.id;
                return data;
            })
        });
    }
    getCombos() {
        return this.combos;
    }
    addCombo(combo: Combo) {
        return this.combosCollection.add(combo);
    }
    deleteCombo(combo: Combo) {
        this.comboDoc = this.afs.doc(`combinations/${combo.id}`);
        this.comboDoc.delete();
    }
    updateCombo(combo: Combo) {
        this.comboDoc = this.afs.doc(`combinations/${combo.id}`);
        this.comboDoc.update(combo);
    }
}