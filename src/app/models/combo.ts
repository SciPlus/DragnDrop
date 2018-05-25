
export interface Combo {
    id?: string;
    result?: {
        id?: "",
        name?: ""
    };
    ingredients?: [
        {
            id?: "",
            name?: ""
        },
        {
            id?: "",
            name?: ""
        }
    ];
    
    // should I change result to a string?
}
// getting combo class/interface to be imported to material.service.ts