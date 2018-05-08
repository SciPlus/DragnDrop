import { Material } from '../models/material';
export interface Combo {
    id?: string;
    ingredients?: Array<Material>;
    result?: Material;
}
// getting combo class/interface to be imported to material.service.ts