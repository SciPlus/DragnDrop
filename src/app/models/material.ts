export interface Material {
    id?: string;
    name?: string;
    definition?: string;
    img?: string;
    isFound?: boolean;
    isStartingMaterial?: boolean;
    isFinalMaterial?: boolean;
}
// getting material class/interface to be imported to material.service.ts