import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-succes',
  templateUrl: './succes.component.html',
  styleUrls: ['./succes.component.scss']
})
export class SuccesComponent implements OnInit {

  nom_complet!: string;
  token!: string;
  ref!: string;
  date!: string;
  prix!: string;
  numero_commande!: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('token') == undefined) {
      this.router.navigate(['/']);
    }

    this.nom_complet = JSON.parse(localStorage.getItem('auth')!).name;
    this.token = localStorage.getItem('token')!.toString();
    this.date = (new Date()).toLocaleDateString('fr-FR');

    this.route.queryParams.subscribe(params => {
      if(params['Erreur'] === "00000") {
        this.prix = (params['Mt'] / 100).toString();

        // récupérer toutes les refs pour savoir ce qui est commandé
        this.http.get<any>('/api/paniers/'+this.token).subscribe({
          next: data => {
            // concaténer les ref
            this.ref = "";
            for(let i=0; i<data.length; i++) {
              this.ref += data[i].ref;
              if (i != data.length-1) {
                this.ref += " | ";
              }
            }

            // post: transférer panier vers commandes
            this.http.post<any>('/api/commandes/', {
              nom_complet: this.nom_complet,
              token: this.token,
              ref: this.ref,
              date: this.date,
              prix: this.prix,
              numero: this.numero_commande
            }).subscribe({
              next: data => {
                console.log("Commande enregistrée.");
              },
              error: error => {
                console.log('Impossible d\'enregistrer la commande: \n' + error.error);
              }
            });
            this.http.delete('/api/paniers/'+this.token+"|").subscribe({
              next: data => {
                console.log('Panier vidé.');
              },
              error: error => {
                console.log('Erreur lors du vidage du panier:\n'+error.error);
              }
            })
            this.router.navigate(['succes']);

          },
          error: error => {
            console.log("Impossible de récupérer les références de la commande: "+error.error);
          }
        })
      }
    });
  }
}
