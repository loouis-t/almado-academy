import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pre-lancement',
  templateUrl: './pre-lancement.component.html',
  styleUrls: ['./pre-lancement.component.scss']
})
export class PreLancementComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  addToCart(): void {
    let thisClientToken = localStorage.getItem('token');

    this.http.get<any>('/api/paniers/'+thisClientToken).subscribe({
      next: data => {
        this.http.get<any>('/api/commandes/'+thisClientToken).subscribe({
          next: data_commandes => {
            ajout_en_local: {
              for(let i=0; i<data.length; i++) {
                if(data[i].ref === "almado-ac-pre-lancement") {
                  alert("Vous avez déjà commandé ce produit : c'est une édition spéciale réservée à Osmoz, que vous ne pouvez commander qu'une seule fois! \n\nSi c'est une erreur et que vous n'avez jamais commandé ce produit, contactez nous : help@almado-academy.fr");
                  break ajout_en_local;
                }
              }
              for(let i=0; i<data_commandes.length; i++) {
                if(data[i].ref === "almado-ac-pre-lancement") {
                  alert("Vous avez déjà commandé ce produit : c'est une édition spéciale réservée à Osmoz, que vous ne pouvez commander qu'une seule fois!");
                  break ajout_en_local;
                }
              }
              localStorage.setItem('panier', JSON.stringify([
                {
                  token: thisClientToken,
                  ref: 'almado-ac-pre-lancement',
                  prix: '100'
                }
              ]));
              this.router.navigate(['panier']);
            }
          },
          error: error => {
            console.log('Impossible de recuperer le panier: ' + error.error);
          }
        });
      },
      error: error => {
        console.log('Impossible de recuperer le panier: ' + error.error);

        localStorage.setItem('panier', JSON.stringify([
          {
            token: thisClientToken,
            ref: 'almado-ac-pre-lancement',
            prix: '100'
          }
        ]));
        this.router.navigate(['panier']);
      }
    });
  }
}
