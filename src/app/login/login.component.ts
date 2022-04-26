import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import * as crypto from 'crypto-js';
const htmlspecialchars = require('htmlspecialchars');

// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { exit } from 'process';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // required variables
  public userDetails: any;
  public type_connexion: string = "E";
  postId!: any;

  providedMail!: string;

  browserIsFacebook: boolean = false;
  deviceIsAndroid: boolean = false; 
  noMailDetected: boolean = false;
  incorrectMail: boolean = false;

  api_prod: string = "https://api.almado-academy.fr/v1";
  api_test: string = "/api";
  api: string = this.api_test;

  constructor(
    private authService: SocialAuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // if user agent is Android
    if (/Android/i.test(navigator.userAgent)) {
      // if user agent is facebook or instagram (android)
      if (navigator.userAgent.indexOf("Instagram") > -1 || navigator.userAgent.indexOf('FB') > -1) {
        this.deviceIsAndroid = true;
        // try to open default browser (android)
        setTimeout(() => {
          let open_default_browser: any = document.querySelector('#open-default-browser')!;
          open_default_browser.click();
        }, 250);
      }
    } else { // if NOT Android
      // if from facebook (iPhone)
      if (navigator.userAgent.indexOf('FB') > -1) {
        this.browserIsFacebook = true;
      } else if (navigator.userAgent.indexOf('Instagram') > -1) {
        // if from instagram (iPhone)
        alert("Ce navigateur ne permet pas d'assurer la sécurité nécessaire à votre connexion.\nRouvrez cette page depuis Safari!");
        this.router.navigate(['/']);   
      }
    }

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
    this.authService.signOut(true)
  }


  handleUser(): void {
    const storage = localStorage.getItem('auth');

    if (storage) {
      // Gérer session courante
      this.userDetails = JSON.parse(storage);
      this.type_connexion = localStorage.getItem('connectionType')!;

      if (this.providedMail == null) {
        if(this.userDetails.email == null) {
          this.noMailDetected = true;   // afficher: veuillez préciser mail
          return;
        } else {
          // ne travailler qu'avec la variable 'this.providedMail'
          this.providedMail = this.userDetails.email;
        }
      }
      // Placer mail dans cookie (reutilisation sur /dashboard)
      localStorage.setItem('email', this.providedMail);

      // Gérer ajout en base
      let thisClientToken = crypto.SHA256(this.type_connexion + this.userDetails.name + this.providedMail + this.userDetails.id).toString(crypto.enc.Hex);
      localStorage.setItem('token', thisClientToken); // keep in session storage

      this.http.get(this.api+'/clients/get/'+thisClientToken).subscribe({
        next: data => {
          // Si déjà dans la base : NE RIEN FAIRE
        },
        error: () => {
          // Si pas dans la base : ON L'AJOUTE
          this.http.post<any>(this.api+'/clients/create/', {
              "nom_complet": this.userDetails.name,
              "token": thisClientToken,
              "mail": this.providedMail,
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
      
      this.route.queryParams
        .subscribe(params => {
          if (params['origin'] == 'panier') {
            this.router.navigate(['panier']);
          } else {
            this.router.navigate(['dashboard']);
          }
        });
    }
  }

  clientProvidesEmail() {
    let mailInput: HTMLInputElement = document.querySelector('#provided-mail')!;
    if (mailInput.value != null && mailInput.value.indexOf("@") > -1) {
      this.providedMail = htmlspecialchars(mailInput.value);
      this.noMailDetected = false;
      
      this.handleUser();
    } else {
      // afficher message ~"mail incorrect" (2s)
      this.incorrectMail = true;
      setInterval(() => {
        this.incorrectMail = false;
      }, 2000);
    }
  }
}
