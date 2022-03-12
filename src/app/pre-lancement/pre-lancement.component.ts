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
        ajout_en_local: {
          for(let i=0; i<data.length; i++) {
            if(data[i].ref === "almado-ac-pre-lancement") {
              alert("Vous ne pouvez pas commander ce produit deux fois!")
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
        console.log('Impossible de recuperer le panier: ' + error);

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
