import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as crypto from 'crypto-js';
import { Router } from '@angular/router';

import {
  SocialAuthService
} from 'angularx-social-login';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // required variables
  public userDetails: any;
  public type_connexion: string = "E";
  postId!: any;

  formations_ligne!: any;
  coachings!: any;
  reglages!: any;


  constructor(
    private authService: SocialAuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.handleUser();
  }

  signOut(): void {
    localStorage.removeItem('auth');
    this.authService.signOut(true);
    this.router.navigate(['login']);
  }

  handleUser(): void {
    const storage = localStorage.getItem('auth');

    if (storage) {
      // Gérer session courante
      this.userDetails = JSON.parse(storage);
      this.type_connexion = localStorage.getItem('connectionType')!;

      // récupérer commandes
      let thisClientToken = crypto.SHA256(this.type_connexion + this.userDetails.name + this.userDetails.mail + this.userDetails.id).toString(crypto.enc.Hex);
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
    } else {
      this.signOut();
    }
  }
}
