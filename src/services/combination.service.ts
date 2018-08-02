import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Combo } from '../app/models/combo';
import { Observable } from 'rxjs/Observable'
@Injectable()
export class CombinationService {
    combosCollection: AngularFirestoreCollection<Combo>
    comboDoc: AngularFirestoreDocument<Combo>;
    existingCombinations: Combo[] = [];

    constructor(public afs: AngularFirestore) {
        let combinations: Observable<Combo[]>;
        this.combosCollection = this.afs.collection('combinations', ref => ref.orderBy('result', 'asc'));
        // this.materials = this.afs.collection('materials').valueChanges();
        combinations = this.combosCollection.snapshotChanges().map(changes => {
            // in addition the other properties of the materials, I am getting their auto-ids.
            return changes.map(action => {
                const data = action.payload.doc.data() as Combo;
                data.id = action.payload.doc.id;
                return data;
            })
        });
        combinations.subscribe(combos => {
            this.existingCombinations = combos;
        });
    }
    getCombos(combinationIds: String[]) {
        let myExistingCombos = combinationIds.map((id) => {
            console.log(` getCombos1(): ${id}`);
            return this.existingCombinations.find(combo => combo.id === id);
        })
        console.log(` getCombos(): ${myExistingCombos}`);
        return myExistingCombos;
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