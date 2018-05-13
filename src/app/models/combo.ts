import { Material } from '../models/material';
export interface Combo {
    id?: string;
    ingredients?: Material[];
    result?: Material;
    // should I change result to a string?
}
// getting combo class/interface to be imported to material.service.ts