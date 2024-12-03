import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageServicesService {
  sender: String = '';
  reciever: string = '';
  constructor(private http: HttpClient) { }

  getAllChatsWithChatId(ids: any): Observable<any> {
    return this.http.post('https://chatversebackend-rz4p.onrender.com/chatApp/get/all-chats', ids);
  }

  updateChats(textMsg: any): Observable<any> {
    return this.http.post(`https://chatversebackend-rz4p.onrender.com/chatApp/update/chatHistory/${textMsg._id}`, textMsg);
  }
}
