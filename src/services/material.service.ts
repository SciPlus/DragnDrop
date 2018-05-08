import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Material } from '../app/models/material';
import { Observable } from 'rxjs/Observable'
@Injectable()
export class MaterialService {
    materialsCollection: AngularFirestoreCollection<Material>
    materials: Observable<Material[]>;
    materialDoc: AngularFirestoreDocument<Material>;
    constructor(public afs: AngularFirestore) {
        this.materialsCollection = this.afs.collection('materials', ref => ref.orderBy('name', 'asc'));
        // this.materials = this.afs.collection('materials').valueChanges();
        this.materials = this.materialsCollection.snapshotChanges().map(changes => {
            // in addition the other properties of the materials, I am getting their auto-ids.
            return changes.map(action => {
                const data = action.payload.doc.data() as Material;
                data.id = action.payload.doc.id;
                return data;
            })
        });
    }
    getMaterials() {
        return this.materials;
    }
    addMaterial(material: Material) {
        return this.materialsCollection.add(material);
    }
    deleteMaterial(material: Material) {
        this.materialDoc = this.afs.doc(`materials/${material.id}`);
        this.materialDoc.delete();
    }
    updateMaterial(material: Material) {
        this.materialDoc = this.afs.doc(`materials/${material.id}`);
        this.materialDoc.update(material);
    }
}