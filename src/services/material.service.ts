import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Material } from '../app/models/material';
import { Observable } from 'rxjs/Observable'
@Injectable()
export class MaterialService {
    materials: Material[] = [];
    materialsCollection: AngularFirestoreCollection<Material>    
    materialDoc: AngularFirestoreDocument<Material>;
    existingMaterials: Material[] = [];
    
    constructor(public afs: AngularFirestore) {
        let materials: Observable<Material[]>;
        this.materialsCollection = this.afs.collection('materials', ref => ref.orderBy('name', 'asc'));
        // this.materials = this.afs.collection('materials').valueChanges();
        materials = this.materialsCollection.snapshotChanges().map(changes => {
            // in addition the other properties of the materials, I am getting their auto-ids.
            return changes.map(action => {
                const data = action.payload.doc.data() as Material;
                data.id = action.payload.doc.id;
                return data;
            })
        });
        materials.subscribe(materials => {
            this.existingMaterials = materials;
        })
    }
    getMaterials(materialsIDs: String[]) {
        let myExistingMaterials = materialsIDs.map((id) => {
            return this.existingMaterials.find(material => material.id === id);
        })
        return myExistingMaterials;
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