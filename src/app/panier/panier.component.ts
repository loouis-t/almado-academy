import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  panier_vide: boolean = true;

  form!: HTMLFormElement;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    let thisClientToken = localStorage.getItem('token');
    var storage = JSON.parse(localStorage.getItem('panier')!);
    
    if (localStorage.getItem('panier') != undefined) { 
      if ((storage[0]).token == null) {         // transérer panier local dans BDD
        storage[0].token = thisClientToken;
        this.http.post<any>('/api/paniers/', storage[0]).subscribe({
          next: data => {
            // vider panier local : eviter rajout en base a chaque actualisation
            localStorage.removeItem('panier');
          },
          error: error => {
            console.log("erreur de mise a jour panier en base" + error.message);
          }
        });
      }
    }

    if (thisClientToken != undefined) {
      // recuperer panier en BDD ou en local
      this.http.get('/api/paniers/'+thisClientToken).subscribe({
        next: data => {
          // si user connecté : BDD
          this.panier = data;
          this.actualiserBoolPanierVide(false);

          // récup mail de cette personne
          this.mail = (JSON.parse(localStorage.getItem('auth')!)).email;

          this.http.get<any>('/api/commandes/').subscribe({
            next: data => {
              this.ref = data.a_attribuer;
            },
            error: error => {
              console.log("Erreur lors de l'appel de la référence de commande (numéro de commande)\n" + error.message);
            }
          });
        },
        error: error => {
          // si non-connecté : local
          console.log('Impossible de recuperer le panier: ' + error);
          this.panier = null;
          this.actualiserBoolPanierVide(true);
        }
      });
    } else {
      if (localStorage.getItem('panier') != null) {
        this.panier = storage;
        this.actualiserBoolPanierVide(false);
      }
    }
  }

  getNomFromRef(ref: string) {
    
    switch(ref) {
      case "almado-ac-reglage":
        return "Réglages vehicule";
      case "almado-ac-formation":
        return "Formation en ligne";
      case "almado-ac-coaching":
        return "Séance de coaching personnalisé";
      default:
        return ref;
    }
  }

  actualiserBoolPanierVide(state: boolean): void {
    this.panier_vide = state;
    const pay_button: HTMLElement = document.querySelector('#pay_button')!;
    if (!this.panier_vide) {
      pay_button.classList.add('button_style');
    } else {
      pay_button.classList.remove('button_style');
    }
  }

  pay(): void {
    if(!this.panier_vide) {
      if (localStorage.getItem('token') != undefined) {
        this.http.post<any>('/api/paiement/', {
          token: localStorage.getItem('token'),
          ref: this.ref,
          mail: this.mail
        }).subscribe({
          next: data => {
            this.hmac = data['cle'];
            this.dateTime = data['date'];
            this.montant = data['montant'];

            console.log(this.montant);
            console.log(this.hmac);
            console.log(this.dateTime);
            

            // submit
            this.form = document.querySelector('#pay_form')!;
            setTimeout(() => {
              this.form.submit();
            }, 250);
          },
          error: error => {
            console.log('Impossible de récupérer les données de nécessaires au paiement: ' + error);
          }
        });
      } else {
        this.router.navigate(['login'], { queryParams: { origin: 'panier' } });
      }
    }
  }

  removeFromCart(ref_to_remove: string): void {
    this.http.delete<any>('/api/paniers/'+localStorage.getItem('token')+"|"+ref_to_remove).subscribe({
      next: data => {
        console.log(data);
      },
      error: error => {
        console.log('Impossible de récupérer les données de nécessaires au paiement: ' + error);
      }
    });
    this.ngOnInit();
  }
}