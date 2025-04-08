export class User {
    //Properties
    id;
    fName;
    lName;
    email;
    username;
    password;

    constructor(fName, lName, email, username, password) {
        this.id = null;
        this.fName = fName;
        this.lName = lName;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    //Methods
    createEvent() {}

    uploadMedia() {}

    shareContent() {}
}
