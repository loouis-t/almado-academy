import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss']
})
export class PanierComponent implements OnInit {

  montant!: string;
  ref!: string;
  mail!: string;
  dateTime!: string;
  hmac!: string;

  panier!: any;
  panier_vide!: boolean;

  form!: HTMLFormElement;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    let thisClientToken = localStorage.getItem('token');
    this.http.get('/api/paniers/'+thisClientToken).subscribe({
      next: data => {
        this.panier = data;
        this.panier_vide = false;
      },
      error: error => {
        console.log('Impossible de recuperer le panier: ' + error);
        
        // utiliser les valeurs stockage local si erreur connexion base
        let storage = localStorage.getItem('panier');
        if (storage) {
          this.panier_vide = false;
          this.panier = JSON.parse(storage);
          console.log(this.panier);
        } else {
          this.panier_vide = true;
        }
        
      }
    });

    if (this.panier_vide) {
      const pay_button: HTMLElement = document.querySelector('#pay')!;
      pay_button!.style.boxShadow = 'none';
      pay_button!.style.textShadow = 'none';
    }
  }

  pay(): void {
    if(!this.panier_vide) {
      this.http.post<any>('/api/paiement/', {
        ref: this.ref,
        mail: this.mail
      }).subscribe({
        next: data => {
          this.hmac = data['cle'];
          this.dateTime = data['date'];
          this.montant = data['montant'];

          // submit
          this.form = document.querySelector('#pay')!;
          setTimeout(() => {
            this.form.submit();
          }, 250);
          

        },
        error: error => {
          console.log('Impossible de récupérer les données de nécessaires au paiement: ' + error);
        }
      });
    }
  }

}