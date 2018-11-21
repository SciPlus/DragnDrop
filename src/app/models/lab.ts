

export interface Lab {
    id?: string;
    entryCode?: string;
    name?: string;
    originalCreator?: string;
    combinationsIDs: String[];
    materialsIDs: String[];
    isFinished: boolean;
    isFoundIDs?: String[];
}