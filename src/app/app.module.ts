import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { HomeComponent } from '././home/home.component';
import { HttpClient } from '@angular/common/http'; 
import { HttpClientModule }  from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';
import { SearchByNamePipe } from './search-by-name.pipe';
import { AuthguardService } from '../../services/authguard.service';
import { ChatRoomHomeComponent } from './chat-room-home/chat-room-home.component';
import { UploadWidgetModule } from "@bytescale/upload-widget-angular";
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { provideAuth, getAuth} from '@angular/fire/auth';
import { provideFirestore, getFirestore} from '@angular/fire/firestore';
import { provideStorage, getStorage } from  '@angular/fire/storage';
import { environment } from "../environment/environment";
// import { SeachByNamePipe } from './seach-by-name.pipe';


const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path:"chat-room-home",component:ChatRoomHomeComponent,canActivate:[AuthguardService],children:[
    {path:"chat-screen/:chatId",component:ChatScreenComponent}
  ]},
  { path: '**', redirectTo: 'login' } // Handle any other routes not matched
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChatListComponent,
    HomeComponent,
    ChatScreenComponent,
    SearchByNamePipe,
    ChatRoomHomeComponent,
    // SeachByNamePipe
  ],
  imports: [
    BrowserModule,
    [RouterModule.forRoot(routes)],
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    UploadWidgetModule,
    provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
    provideAuth(()=>getAuth()),
    provideFirestore(()=> getFirestore()),
    provideStorage(()=>getStorage()), 
  ],
  exports: [RouterModule,
   ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
