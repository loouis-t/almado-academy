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
  commandes = commandes;

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
  }


  handleUser(): void {
    const storage = localStorage.getItem('auth');

    if (storage) {
      this.userDetails = JSON.parse(storage);
      this.logged = true;
    }
  }
}

export interface commande {
  type: String;
  date: String;
}

export const commandes = [
  {
    type: "Coaching personnalisé",
    date: "14-09-2002"
  },
  {
    type: "Réglage voiture",
    date: "12-07-2002"
  }
]