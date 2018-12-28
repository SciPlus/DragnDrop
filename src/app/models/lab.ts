

export interface Lab {
    id?: string;
    purpose?: string;
    entryCode?: string;
    name?: string;
    originalCreator?: string;
    combinationsIDs: String[];
    materialsIDs: String[];
    isFinished: boolean;
    sharedWith?: String[];
}