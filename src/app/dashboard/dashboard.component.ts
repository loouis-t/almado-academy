import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  
  email!: string;
  postId!: any;

  commandes!: any;


  constructor(
    private authService: SocialAuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.handleUser();
  }

  signOut(): void {
    localStorage.clear();
    this.authService.signOut(true);
    this.router.navigate(['login']);
  }

  handleUser(): void {
    const storage = localStorage.getItem('auth');
    
    if (storage) {
      // Gérer session courante
      this.userDetails = JSON.parse(storage);
      this.type_connexion = localStorage.getItem('connectionType')!;
      this.email = localStorage.getItem('email')!;

      if (this.email == null && this.userDetails.email == null) {
        this.signOut();
      }
      
      // récupérer commandes (recup token dans session)
      let thisClientToken = localStorage.getItem('token');

      this.http.get('https://api.almado-academy.fr/v1/commandes/get/'+thisClientToken).subscribe({
        next: data => {
          this.commandes = data;
        },
        error: error => {
          console.log("Aucune commande trouvée");
        }
      });
    } else {
      this.signOut();
    }
  }

  prixProduit(el: string) {
    switch(el) {
      case "almado_ac_coaching":
        return 25;
      case "almado_ac_formation":
        return 30;
      case "almado_ac_reglage":
        return 10;
      default:
        return "";
    }
  }
}
