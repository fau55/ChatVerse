import { Component, Input } from '@angular/core';
import { UserServicesService } from '../../../services/user-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MessageServicesService } from '../../../services/message-services.service';

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css']
})
export class ChatScreenComponent {
  // getting the friend details and Chat id from chat list
  @Input() chatId: any;
  // showing Friend name
  chatWithuser: String = "";
  friendProfile: String = '';
  Status: string = '';

  // all Chats
  allChats: any;
  userId: string = '';
  textMessage: String = '';
  friendId: String = '';
  chat: String = '';
  chat_id: String = '';
  isActive:boolean = false;
  lastOnLine : string = ''
  
  // friend info
friendAboutUs = ''
friendProfilePhoto = ''
friendEmailId = ''
friendCreatedAccount = ''
  constructor(private messageService: MessageServicesService, private route: ActivatedRoute, private userService: UserServicesService) { }
  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.chat_id = param['chatId'];
      // setInterval(()=>{
      this.getAllChats();
      // },1000)
      console.log("- - - - - - ChatId : ", this.chat_id);
    });
  

  }
  
  
  
  updateChat() {
    let newMsg = {
      _id: this.chat_id,
      chat_History: {
        messageText: this.textMessage,
        sender_Id: this.userId,
        reciever_Id: this.friendId,
        sent_At: new Date()
      }
    };
    console.log('newMsg', newMsg);
    this.messageService.updateChats(newMsg).subscribe(
      (res) => {
        // Handle success
        console.log(res);
        this.textMessage = '';
        this.getAllChats();
      },
      (error) => {
        // Handle error
        console.error(error);
      }
    );

  }

  getAllChats() {
    this.userId = sessionStorage.getItem('UserId')!;
    this.friendId = sessionStorage.getItem('friendId')!;
    this.userService.getUserById({ _id: this.friendId }).subscribe((res: any) => {
      console.log("user info by Id ",res.userInfo[0]); // Log the first element of the array
        const userInfo = res.userInfo[0]; // Access the first element of the array
        this.chatWithuser = userInfo.firstName + ' ' + userInfo.lastName;
        // this.friendProfile = userInfo.profilePhoto
        this.isActive = userInfo.isActive;
        this.lastOnLine = userInfo.lastOnline
        this.Status = this.isActive ? 'Online' : this.lastOnLine;
        this.friendAboutUs = userInfo.aboutAs
        this.friendCreatedAccount = userInfo.createdOn
        this.friendProfilePhoto = userInfo.profilePhoto
        this.friendEmailId = userInfo.email
        // this.Status ='online'? userInfo.isActive === true : userInfo.lastOnline 
    });
    let chatIdWith = {
      _id: this.chat_id
    };
    
    console.log("chat id", chatIdWith);
    this.messageService.getAllChatsWithChatId(chatIdWith).subscribe((res) => {
      this.allChats = res.chats[0].chat_History;
    });
  }

  
}
