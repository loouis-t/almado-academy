import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
const htmlspecialchars = require('htmlspecialchars');

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss']
})
export class PanierComponent implements OnInit {

  url_prod: string = "https://www.almado-academy.fr";
  url_test: string = "http://localhost:4200";
  url: string = this.url_prod;

  api_prod: string = "https://api.almado-academy.fr/v1";
  api_test: string = "/api";
  api: string = this.api_prod;

  montant!: string;
  numero_commande!: string;
  mail!: string;
  dateTime!: string;
  hmac!: string;

  nom_complet!: string;
  billing!: string;
  shopping_cart!: string;
  clientToken!: string;

  panier!: any;
  panier_vide: boolean = true;

  form!: HTMLFormElement;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.clientToken = localStorage.getItem('token')!;
    var storage = JSON.parse(localStorage.getItem('panier')!);
    
    if (localStorage.getItem('panier') != undefined) { 
      if ((storage[0]).token != null || this.clientToken != undefined) {         // transérer panier local dans BDD
        this.http.post<any>(this.api+'/paniers/create/', {
          token: storage[0].token || this.clientToken,
          ref: storage[0].ref,
          prix: storage[0].prix
        }).subscribe({
          next: data => {
            // vider panier local : eviter rajout en base a chaque actualisation
            localStorage.removeItem('panier');
            window.location.reload();
          },
          error: error => {
            console.log("erreur de mise a jour panier en base" + error.message);
            alert('Une erreur est survenue lors d\'un appel en base, veuillez nous excuser pour la gêne occasionnée. \nVous pouvez tenter d\'actualiser la page. Si le problème persiste, informez-nous : help@almado-academy.fr\n\ncode : 001');
          }
        });
      }
    }
    
    if (this.clientToken != undefined) {
      // recuperer panier en BDD ou en local
      this.http.get(this.api+'/paniers/get/'+this.clientToken).subscribe({
        next: data => {
          // si user connecté : BDD
          this.panier = data;
          this.actualiserBoolPanierVide(false);
          
          // récup mail de cette personne
          this.mail = (JSON.parse(localStorage.getItem('auth')!)).email;
          
          
        },
        error: error => {
          // si non-connecté : local
          console.log('Impossible de recuperer le panier: \n'+(error.message || error.error));
          this.panier = null;
          this.actualiserBoolPanierVide(true);
          if(error.status == '504') {
            alert('Une erreur est survenue lors d\'un appel en base, veuillez nous excuser pour la gêne occasionnée. \nVous pouvez tenter d\'actualiser la page. Si le problème persiste, informez-nous : help@almado-academy.fr\n\ncode : 003');
          }
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
        return "Séance de coaching personnalisé (1 pers.)";
        case "almado-ac-coaching-group":
          return "Séance de coaching personnalisé (5 pers.)";
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
        // data to post to https://api.almado-academy.fr/v1 and CA module
        this.nom_complet = JSON.parse(localStorage.getItem('auth')!).name;
        this.billing = `<?xml version="1.0" encoding="utf-8"?><Billing><Address><FirstName>${this.nom_complet.split(" ")[0]}</FirstName><LastName>${this.nom_complet.split(" ")[1]}</LastName><Address1>33 bis chemin de Lagrange</Address1><ZipCode>31120</ZipCode><City>Roques</City><CountryCode>250</CountryCode></Address></Billing>`;
        this.shopping_cart = `<?xml version="1.0" encoding="utf-8"?><shoppingcart><total><totalQuantity>${this.panier.length}</totalQuantity></total></shoppingcart>`;


        this.http.get<any>(this.api+'/commandes/max/').subscribe({
          next: data => {
            this.numero_commande = data.a_attribuer;
            console.log(this.numero_commande);

            this.http.post<any>(this.api+'/paiement/', {
              token: localStorage.getItem('token'),
              numero_commande: this.numero_commande,
              mail: this.mail,
              nom_complet: this.nom_complet,
              cart: this.panier.length
            }).subscribe({
              next: data => {
                //données pour le form
                this.hmac = data['cle'];
                this.dateTime = data['date'];
                this.montant = data['montant'];
                
                console.log(this.montant);
                console.log(this.hmac);
                console.log(this.dateTime);
                console.log(this.billing);
                
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
        },
        error: error => {
          console.log("Erreur lors de l'appel de la référence de commande (numéro de commande)\n" + error.message);
          alert('Une erreur est survenue lors d\'un appel en base, veuillez nous excuser pour la gêne occasionnée. \nVous pouvez tenter d\'actualiser la page. Si le problème persiste, informez-nous : help@almado-academy.fr\n\ncode : 002');
        }});
      } else {
        this.router.navigate(['login'], { queryParams: { origin: 'panier' } });
      }
    }
  }

  removeFromCart(ref_to_remove: string): void {
    localStorage.removeItem('panier');

    this.http.post<any>(this.api+'/paniers/delete/', {
      token: localStorage.getItem('token'),
      ref: ref_to_remove
    }).subscribe({
      next: data => {
        console.log(data);
        window.location.reload();
      },
      error: error => {
        console.log('Erreur lors de la suppression d\'un élément du panier : ' + error);
      }
    });
  }

}
