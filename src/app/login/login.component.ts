import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { UserServicesService } from '../../../services/user-services.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginControl: FormGroup;

  constructor(private userService: UserServicesService, private router: Router) {
    this.loginControl = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }
  loginUser() {
    if(this.loginControl.valid){
      let userToLogin = {
        email : this.loginControl.get('email')?.value,
        password : this.loginControl.get('password')?.value
      }
      this.userService.userLogin(userToLogin).subscribe((response: any) => {
        console.log(response.userId);
        if (response.userIsExists) {
          
          this.showAlert('success', 'Login Successfull!')
          sessionStorage.setItem('UserId', response.userId)
          this.router.navigate(['/chat-room-home'])
        }
        else {
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
      
          Toast.fire({
            icon: 'error',
            text: response.Message
          });
        }
      })
    }
    else{
      this.showAlert('warning', 'Please fill all the fields')
    }

  }

  showAlert(icon: any, text: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: icon,
      text: text
    });
  }

  togglePass(){
    const passInput = document.getElementById('pass') as HTMLInputElement;
    if (passInput) {
      if (passInput.type === 'password') {
        passInput.type = 'text';
      } else {
        passInput.type = 'password';
      }
    }
  }



}
