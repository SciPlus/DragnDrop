import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable'
import { MaterialService } from '../services/material.service';
import { Material } from '../../src/app/models/material';

@Injectable()
export class IsFoundService{
    materials: Material[] = [];
    isFoundIds: String[] = [];
    existingIsFoundMaterials: Material[] = [];
    i: number = 0;
    
    constructor(private materialService: MaterialService, public afs: AngularFirestore) {
        this.materials = this.materialService.getMaterials();
        this.materials.forEach(material => {
            if (material.isStartingMaterial) {
            this.isFoundIds.push(material.id);
            }
        });
        for (this.i = 0; this.i <= this.isFoundIds.length; this.i++) {
            this.materials.forEach(material => {
                if (material.id === this.isFoundIds[this.i])
                    this.existingIsFoundMaterials.push(material);
            })
        }
        this.i = 0;
    };
    addFoundMaterial(material: Material) {
        if (this.isFoundIds.indexOf(material.id) === -1) {
            this.isFoundIds.push(material.id);
            this.existingIsFoundMaterials.push(material);
        }
    }
    deleteFoundMaterial(material: Material) {
        var index = this.isFoundIds.indexOf(material.id);
        if (index != -1) {
            this.isFoundIds.splice(index, 1);
          }
    }
    getIsFoundMaterials() {
        return this.existingIsFoundMaterials;
    }
}