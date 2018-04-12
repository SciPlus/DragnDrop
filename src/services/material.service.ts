import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Material } from '../app/models/material';
import { Observable } from 'rxjs/Observable'
@Injectable()
export class MaterialService {
    materialsCollection: AngularFirestoreCollection<Material>
    materials: Observable<Material[]>;
    constructor(public afs: AngularFirestore) {
        this.materials = this.afs.collection('materials').valueChanges();
    }
    getMaterials() {
        return this.materials;
    }
}