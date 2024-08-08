export class User {
    firstName: String
    lastName: String
    password: String;
    profilePhoto: String
    onlineAt: String = '--'
    email: String
    isActive = ''
    _id : String = ''
    constructor(firstName: String, lastName: String, password: String, profilePhoto: String, email: String) {
        this.firstName = firstName,
            this.lastName = lastName
        this.password = password,
            this.profilePhoto = profilePhoto
        this.email = email;
    }
}