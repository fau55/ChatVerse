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
    return this.http.post('http://localhost:2500/chatApp/get/all-chats', ids);
  }

  updateChats(textMsg: any): Observable<any> {
    return this.http.post(`http://localhost:2500/chatApp/update/chatHistory/${textMsg._id}`, textMsg);
  }
}
