import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as crypto from 'crypto-js';

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
  public type_connexion: string = "E";
  postId!: any;

  formations_ligne!: any;
  coachings!: any;
  reglages!: any;

  constructor(
    private authService: SocialAuthService,
    private http: HttpClient
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
              localStorage.setItem('connectionType', "G");
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
              localStorage.setItem('connectionType', "F");
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
      // Gérer session courante
      this.userDetails = JSON.parse(storage);
      this.type_connexion = localStorage.getItem('connectionType')!;
      this.logged = true;

      // Gérer ajout en base
      let thisClientToken = crypto.SHA256(this.type_connexion + this.userDetails.name + this.userDetails.mail + this.userDetails.id).toString(crypto.enc.Hex);
      this.http.get('/api/clients/'+thisClientToken).subscribe({
        next: data => {
          // Si déjà dans la base : NE RIEN FAIRE (chercher commandes)
          this.http.get('/api/formations_ligne/'+thisClientToken).subscribe({
            next: data => {
              this.formations_ligne = data;
            },
            error: error => {
              console.log("Aucune commande de formation en ligne");
            }
          });
          this.http.get('/api/coachings/'+thisClientToken).subscribe({
            next: data => {
              this.coachings = data;
            },
            error: error => {
              console.log("Aucune commande de coaching");
            }
          });
          this.http.get('/api/reglages/'+thisClientToken).subscribe({
            next: data => {
              this.reglages = data;
            },
            error: error => {
              console.log("Aucune commande de réglage");
            }
          });
        },
        error: () => {
          // Si pas dans la base : ON L'AJOUTE
          this.http.post<any>('/api/clients/', {
              "nom_complet": this.userDetails.name,
              "token": thisClientToken,
              "mail": this.userDetails.email,
              "type_connexion": this.type_connexion
          }).subscribe({
            next: data => {
              this.postId = data.id;
              console.log(data.id);
              
            },
            error: error => {
              console.error('Il y a eu une erreur!', error);
            }
          });
        }
      });
      

    }
  }
}
