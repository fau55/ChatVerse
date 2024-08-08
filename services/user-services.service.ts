import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {
  currentlyActiveUser: String = '';
  // user services
  constructor(private http: HttpClient) { }

  // showing all users in Chat-list
  getAllUsers() {
    return this.http.get('http://localhost:2500/chatApp/getAllUsers')
  }
  // registration
  addNewUser(user: any) {
    return this.http.post('http://localhost:2500/chatApp/register', user)
  }

  // for login (checking if the email id and password is correct)
  userLogin(user: any) {
    return this.http.post('http://localhost:2500/chatApp/login', user)
  }

  // using this method for logout
  userLogout(user: any) {
    return this.http.post('http://localhost:2500/chatApp/logout', user)
  }

getUserById(id: any){
  return this.http.post('http://localhost:2500/api/chatApp/getUser/byId', id)
}

  // creating chat history
  setChatWithUserName(createChatHistory: any) {
    return this.http.post('http://localhost:2500/chatApp/create/chatHistory', createChatHistory)
  }

  updateProfile(pic : any){
    console.log('service file ka pic :', pic);
    return this.http.post(`http://localhost:2500/api/chatApp/user/uploadpic/${pic._id}`, pic) 
  }
  updateStatus(aboutUs : any){
    return this.http.post(`http://localhost:2500/api/chatApp/user/upload-about-us/${aboutUs._id}`, aboutUs) 
  }
  updateName(name : any){
    return this.http.post(`http://localhost:2500/api/chatApp/user/upload-name/${name._id}`, name) 
  }
}
