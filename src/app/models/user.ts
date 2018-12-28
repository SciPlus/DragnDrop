export interface User {
    id?: string; // id given in database 
    userId?: string; // id given in authentication --> connected now to database
    userName?: string; // same as in authentication
    myLabs?: [
        {
            labId?: string;
            isFoundIds?: string[]
        },
        {
            labId?: string;
            isFoundIds?: string[]
        }
    ]
// or should it be that whenever you create a user its id = the user's id? ?--> ehh

    // can add image and other properties later
}
// getting user class/interface to be imported to user.service.ts