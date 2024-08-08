import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService{
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  canActivate() {
  if(sessionStorage.getItem("UserId")!="" && sessionStorage.getItem("UserId")!=null)
    return true;
  else
  {
    this.router.navigate(['/login'])//?404 error
    return false;
  }
  }
}