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
    return this.http.get('https://chatversebackend-rz4p.onrender.com/chatApp/getAllUsers')
  }
  // registration
  addNewUser(user: any) {
    return this.http.post('https://chatversebackend-rz4p.onrender.com/chatApp/register', user)
  }

  // for login (checking if the email id and password is correct)
  userLogin(user: any) {
    return this.http.post('https://chatversebackend-rz4p.onrender.com/chatApp/login', user)
  }

  // using this method for logout
  userLogout(user: any) {
    return this.http.post('https://chatversebackend-rz4p.onrender.com/chatApp/logout', user)
  }

  getUserById(id: any) {
    return this.http.post('https://chatversebackend-rz4p.onrender.com/api/chatApp/getUser/byId', id)
  }

  // creating chat history
  setChatWithUserName(createChatHistory: any) {
    return this.http.post('https://chatversebackend-rz4p.onrender.com/chatApp/create/chatHistory', createChatHistory)
  }

  updateProfile(pic: any) {
    console.log('service file ka pic :', pic);
    return this.http.post(`https://chatversebackend-rz4p.onrender.com/api/chatApp/user/uploadpic/${pic._id}`, pic)
  }
  updateStatus(aboutUs: any) {
    return this.http.post(`https://chatversebackend-rz4p.onrender.com/api/chatApp/user/upload-about-us/${aboutUs._id}`, aboutUs)
  }
  updateName(name: any) {
    return this.http.post(`https://chatversebackend-rz4p.onrender.com/api/chatApp/user/upload-name/${name._id}`, name)
  }
}
