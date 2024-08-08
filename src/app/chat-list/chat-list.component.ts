import { Component, Input } from '@angular/core';
import { UserServicesService } from '../../../services/user-services.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UploadWidgetConfig, UploadWidgetOnUpdateEvent } from "@bytescale/upload-widget";
import { Storage, ref, uploadBytesResumable, getDownloadURL } from "@angular/fire/storage";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent {
  searchName: string = '';
  userArray: any[] = [];
  chatWithUserId: string = '';
  currentUserId: string = '';
  chatId: any;
  // for loggout
  loggedInUser: any;

  uploadImageURL : string = '';
  showPreviewImage : boolean = false;
  fileName : string = 'Image';

  myProfile: String =''
  myName : String = ''
  createdThisAccountOn : string = ''
  myEmail : String = ''
  myFirstName : String = ''
  myLastName : String = ''
  myAboutAs : String = ''
  status : string = ''


  constructor(private userService: UserServicesService, private router: Router,
    public storage : Storage,
   
  ) { }

  ngOnInit() {
    this.allUsers();
    // this.loggedInUser = this.userService.getCurrentryActiveUser();
    console.log(this.loggedInUser);
    this.currentUserId = sessionStorage.getItem('UserId')!
    // this.getUserInfo()
  }

  // image upload code, configuration and logic..
  // for more configurations visit : https://www.bytescale.com/docs/upload-widget/angular#configuration
  options: UploadWidgetConfig = {
    apiKey: "free", // Get API key: https://www.bytescale.com/get-started
    maxFileCount: 1,
    multi: false,
    mimeTypes:["image/jpeg","image/png"],
    showFinishButton: false,
    showRemoveButton: true,
    styles:{
      colors: {
        "active": "#e597eb",
        "error": "#d23f4d",
        "primary": "#db0d63",
        "shade100": "#db0d63",
        "shade200": "#f53b88",
        "shade300": "#db0d63",
        "shade400": "#f53b88",
        "shade500": "#d3d3d3",
        "shade600": "#f53b88",
        "shade700": "#f0f0f0",
        "shade800": "#f8f8f8",
        "shade900": "#fff"
      }
    }    
  };  

  // ye method image upload karte hi execute honga.. aur hame image url milenga.. bytescale pe upload hongi ye image sabse pehle..
  onUpdate = ({ uploadedFiles, pendingFiles, failedFiles }: UploadWidgetOnUpdateEvent) => {   
    if(uploadedFiles && uploadedFiles.length != 0){
      this.fileName = uploadedFiles[0].originalFile.file.name;
    }
    const uploadedFileUrls = uploadedFiles.map(x => x.fileUrl).join("\n");
    this.uploadImageURL = uploadedFileUrls;
    console.log(uploadedFileUrls);
    if(this.uploadImageURL != ''){
      this.showPreviewImage = true;
      this.height = "300px";
    }
    else{
      this.showPreviewImage = false;
      this.uploadImageURL = '';
      this.height = "300px"
    }
  };
  width = "600px";
  height = "300px";

  chatWith(user: any) {
    // geting the id of frined
    sessionStorage.setItem('friendId', user._id);
    this.chatWithUserId = user._id;
    let createChatHistory = {
      self_Id: this.currentUserId,
      friend_Id: this.chatWithUserId
    };

    this.userService.setChatWithUserName(createChatHistory).subscribe((res: any) => {
      // res.chat._id = chat id
      this.router.navigate(['/chat-room-home/chat-screen/',res.chat._id])
    });
  }
  // getting All the users
  allUsers() {
    this.userService.getAllUsers().subscribe(
      (response: any) => {
        this.userArray = response.User_list;
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  
  userLogout() {
    Swal.fire({
      text: "Are you Sure You Want To logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.userLogout({_id: this.currentUserId}).subscribe((res:any)=>{
          console.log(res);
        })
        sessionStorage.clear();
        this.router.navigate(['/login']);
        Swal.fire({
          title: "User Logout",
          text: "Successfully!!",
          icon: "success"
        });
      }
    });
  }

  getUserInfo(){
    this.userService.getUserById({_id: this.currentUserId}).subscribe((res:any)=>{
      const info = res.userInfo[0]
      this.myEmail = info.email;
      this.myName = info.firstName + ' '+ info.lastName;
      this.myProfile = info.profilePhoto;
      this.createdThisAccountOn = info.createdOn;
      this.status = info.aboutAs;
      this.myFirstName = info.firstName;
      this.myLastName = info.lastName
    })
  }

  onSave(){
    // converting the bytescale url to file format..
    // pehle bytescale url ko file may convert karenge..
    // phir uss file ko firebase may send karenge..ho hame firebase url denga..usse hum database may as a image url save karenge
   this.convertUrlToFile(this.uploadImageURL);   
  }
  uploadToFireBase(imageFile : any){
    if(imageFile != '' && imageFile != null && imageFile.length != 0){
      // uploading to firebase...
      const storageRef = ref(this.storage,`images/users/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on('state_changed',
      (snapshot)=>{
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      // Handle unsuccessful uploads
    }, 
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        // this.showPreviewImage = true;
        // let FirebaseImageURL = downloadURL;
        let profileToUpdate = {
          _id : this.currentUserId,
          profilePhoto : downloadURL
        }
        console.log('profile to update:', profileToUpdate);

        this.userService.updateProfile(profileToUpdate).subscribe((res)=>{
          console.log('ye update profile ka res hai', res);
          this.getUserInfo()
        })

    // creating an object to pass in the body of add category api
   
    // saving the category..
    // now passing the above created object in the post API... 
      });
  
      })
    }  
  }

  convertUrlToFile(url : string){
  fetch(url)
  .then(async response => {
    const contentType = response.headers.get('content-type')
    const blob = await response.blob()
    const file = new File([blob], this.fileName,{type:'image/png'})
    // access file here
    this.uploadToFireBase(file);    
  })    
  }

  updateStatus(){
    let statusToUpdate = {
      _id : this.currentUserId,
      aboutAs : this.status
    }
    this.userService.updateStatus(statusToUpdate).subscribe((res)=>{
      console.log(res);
      this.getUserInfo()
    })
  }
  updateName(){
    let nameToUpdate= {
      _id : this.currentUserId,
      firstName : this.myFirstName,
      lastName : this.myLastName
    }
    this.userService.updateName(nameToUpdate).subscribe((res)=>
    {
      console.log(res);
      this.getUserInfo()
    })
  }
  
}
