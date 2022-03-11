import { Component, OnInit, ElementRef } from '@angular/core';
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
    let storage = localStorage.getItem('panier');
    if (storage && (storage[0])[2] != null) {
      this.panier_vide = false;
      this.panier = JSON.parse(storage);
      this.http.post<any>('/api/paniers/', this.panier).subscribe({
        next: data => {
          localStorage.removeItem('panier');
        }
      });
    } else {
      this.panier_vide = true;
    }
    
    this.http.get('/api/paniers/'+thisClientToken).subscribe({
      next: data => {
        this.panier = data;
        this.panier_vide = false;

        // récup mail de cette personne
        this.mail = (JSON.parse(localStorage.getItem('auth')!)).email;
        this.ref = "remplir_ca";
      },
      error: error => {
        console.log('Impossible de recuperer le panier: ' + error);
        
        // utiliser les valeurs stockage local si erreur connexion base
        
        
      }
    });

    if (this.panier_vide) {
      const pay_button: HTMLElement = document.querySelector('#pay_button')!;
      pay_button!.style.boxShadow = 'none';
      pay_button!.style.textShadow = 'none';
    }
  }

  getNomFromRef(ref: string) {
    
    switch(ref) {
      case "almado_ac_reglage":
        return "Réglages vehicule";
      case "almado_ac_formation":
        return "Formation en ligne";
      case "almado_ac_coaching":
        return "Séance de coaching personnalisé";
      default:
        return "";
    }
  }

  pay(): void {
    if(!this.panier_vide) {
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
    }
  }
}