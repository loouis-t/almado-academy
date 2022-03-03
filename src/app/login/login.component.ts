import { Component, OnInit } from '@angular/core';

// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // required variables
  public userDetails: any;
  logged?: boolean = false;

  constructor(
    private authService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.handleUser();    // handle on changing page while navigating
  }


  // required functions
  signInHandler(service: string): void {

    switch (service) {
      case "google":
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
          .then((data) => {
            console.log("connexion ok");
            
            if (data.idToken != null) {
              
              localStorage.setItem('auth', JSON.stringify(data));
              this.logged = true;
              this.handleUser();  // handle right after connection
            } else {
              console.log("Erreur de connexion. [idToken=null]");
            }
          });
        break;
      
        case "facebook":
          this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
            .then((data) => {
              if (data.authToken != null) {
                localStorage.setItem('auth', JSON.stringify(data));
                this.logged = true;
                this.handleUser();  // handle right after connection
              } else {
                console.log("Erreur de connexion.  [authToken=null]");
              }
            })
          break;

        default:
          console.log("Aucun service sécifié.");
          break;
      };
  }

  signOut(): void {
    localStorage.removeItem('auth');
    this.logged = false;
    this.authService.signOut(true)
      .then(() => {
        console.log("déconnecté");
      })
      .catch(() => {
        console.log("Aucun utilisateur connecté");
      });
  }


  handleUser(): void {
    const storage = localStorage.getItem('auth');

    if (storage) {
      this.userDetails = JSON.parse(storage);
      this.logged = true;
      console.log("storage ok");
    }
  }
}

// const googleLoginOptions = {
//   scope: 'email'
// };

  // // loginForm: FormGroup;
  // socialUser!: SocialUser;
  // isLoggedin: boolean = false;
  // session: any;
  
  // constructor(
  //   // private formBuilder: FormBuilder,
  //   private socialAuthService: SocialAuthService
  // ) { }
  
  // ngOnInit(): void {
  //   // this.loginForm = this.formBuilder.group({
  //   //   email: ['', Validators.required],
  //   //   password: ['', Validators.required],
  //   // });

  //   this.socialAuthService.authState.subscribe((user) => {
  //     console.log("Etape 1");

  //     this.socialUser = user;
  //     this.isLoggedin = (user != null);
      
  //     // if (this.socialUser != null) {
  //     //   localStorage.setItem('currentUser', this.socialUser.name);
  //     //   localStorage.setItem('currentToken', this.socialUser.idToken);
  //     //   localStorage.setItem('currentEmail', this.socialUser.email);

  //     // } else {
  //     //   localStorage.setItem('currentUser', '');
  //     //   localStorage.setItem('currentToken', '');
  //     //   localStorage.setItem('currentEmail', '');
  //     // }
  //   });

  //   this.session = { 
  //     'name': localStorage.getItem('currentUser'),
  //     'token': localStorage.getItem('currentToken'),
  //     'email': localStorage.getItem('currentEmail')
  //   }

  //   this.isLoggedin = localStorage.getItem('currentUser') != null;
  // }


  
  // loginWithGoogle(): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID/*, googleLoginOptions*/);

  //   console.log("Etape 0");
  // }

  // loginWithFB(): void {
  //   this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }

  // logOut(): void {
  //   this.socialAuthService.signOut();

  //   // this.socialUser = new SocialUser; // reset social user
  // }

  // refreshToken(): void {
  //   this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  // }

  
