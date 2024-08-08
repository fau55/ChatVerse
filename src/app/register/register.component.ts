import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserServicesService } from '../../../services/user-services.service';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
// import Img from '../../assets/images/profilePic.jpg'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  userControl: FormGroup;
  profilePic : String = '';

  @ViewChild('pass')private pass!: ElementRef;
  constructor(private userService: UserServicesService, private router: Router) {
    this.userControl = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      confirmPass: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    })
  }

  registerUser() {
    if (this.userControl.valid) {
      if (this.userControl.get('password')?.value !== this.userControl.get('confirmPass')?.value) {
        this.showAlert('error', 'Password does not match');
        this.userControl.get('password')?.setValue('');
        this.userControl.get('confirmPass')?.setValue('');
      } else {  
        // this.profilePic = this.userControl.get('gender')?.value === "female" ? "female.jpg" : "male.jpg";
        const userToRegister = new User(
          this.userControl.get('firstName')?.value,
          this.userControl.get('lastName')?.value,
          this.userControl.get('password')?.value,
          this.profilePic = '../../assets/images/profilePic.jpg',
          this.userControl.get('email')?.value
        );
        console.log(userToRegister);
        this.userService.addNewUser(userToRegister).subscribe(
          (response: any) => {
            if (response.isUserExist) {
              this.showAlert('warning', `Email Id : ${response.user_name} ${response.Message}`);
              this.userControl.get('password')?.setValue('');
              this.userControl.get('confirmPass')?.setValue('');
              this.userControl.get('gender')?.setValue('');
              this.userControl.get('firstName')?.setValue('');
              this.userControl.get('lastName')?.setValue('');
              this.userControl.get('email')?.setValue('');
            } else {
              this.showAlert('success', 'Registration Successful');
              this.router.navigate(['/login']);
            }
          },
          error => {
            this.showAlert('error', 'An error occurred while registering. Please try again later.');
          }
        );
      }
    } else {
      this.showAlert('warning', 'Please fill all the fields');
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
