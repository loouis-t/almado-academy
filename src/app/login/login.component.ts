import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // loginForm: FormGroup;
  socialUser!: SocialUser;
  isLoggedin: boolean = false;
  session: any;
  
  constructor(
    // private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService
  ) { }
  
  ngOnInit(): void {
    // this.loginForm = this.formBuilder.group({
    //   email: ['', Validators.required],
    //   password: ['', Validators.required],
    // });

    this.socialAuthService.authState.subscribe((user) => {
      console.log("Etape 1");

      this.socialUser = user;
      this.isLoggedin = (user != null);
      
      // if (this.socialUser != null) {
      //   localStorage.setItem('currentUser', this.socialUser.name);
      //   localStorage.setItem('currentToken', this.socialUser.idToken);
      //   localStorage.setItem('currentEmail', this.socialUser.email);

      // } else {
      //   localStorage.setItem('currentUser', '');
      //   localStorage.setItem('currentToken', '');
      //   localStorage.setItem('currentEmail', '');
      // }
    });

    this.session = { 
      'name': localStorage.getItem('currentUser'),
      'token': localStorage.getItem('currentToken'),
      'email': localStorage.getItem('currentEmail')
    }

    this.isLoggedin = localStorage.getItem('currentUser') != null;
  }


  
  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID/*, googleLoginOptions*/);

    console.log("Etape 0");
  }

  loginWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  logOut(): void {
    this.socialAuthService.signOut();

    // this.socialUser = new SocialUser; // reset social user
  }

  refreshToken(): void {
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  
}

// const googleLoginOptions = {
//   scope: 'email'
// };
