import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.scss']
})
export class CoachingComponent implements OnInit {
  mail: string = "essai@gmail.com";
  dateTime!: string;
  montant!: string;
  hmac!: string;
  
  form!: HTMLFormElement;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // ajouter [appel page login] si aucun utilisateur connecté
  addToCart(): void {
    let thisClientToken = localStorage.getItem('token');
    
    this.http.post<any>('/api/paniers/', {
      token: thisClientToken,
      ref: "almado_ac_coaching",
      prix: "25"
    }).subscribe({
      next: data => {
      },
      error: error => {
        console.log('Impossible de récupérer le panier de ce client: ' + error);
      }
    });

    // ajouter aussi en local en cas d'erreur de connexion a la base
    localStorage.setItem('panier', JSON.stringify([{
      token: thisClientToken,
      ref: 'almado_ac_coaching',
      prix: '25'
    }]));
    console.log(localStorage.getItem('panier'));
    this.router.navigate(['panier']);
  }
}
