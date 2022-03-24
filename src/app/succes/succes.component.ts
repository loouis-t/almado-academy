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
      if(params['Sign'] != undefined){
        if (params['Erreur'] === "00000") {
          this.prix = (params['Mt'] / 100).toString();

          let uri_data = (this.route.snapshot as any)['_routerState'].url.split('succes?')[1].split('&Sign')[0]; // recupérer toute la chaine avant '&Sign'
          this.http.post<any>('/api/sign/', {
            signature: params['Sign'],
            data: uri_data
          }).subscribe({
            next: data => {
              if (data['isVerified']) {
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
                        this.router.navigate(['echec'], { queryParams: { Erreur: 'int001' } });
                      }
                    });
                    
                    // vider panier
                    this.http.delete('/api/paniers/'+this.token+"|").subscribe({
                      next: data => {
                        console.log('Panier vidé.');
                      },
                      error: error => {
                        console.log('Erreur lors du vidage du panier:\n'+error.error);
                        this.router.navigate(['echec'], { queryParams: { Erreur: 'int002' } });
                      }
                    })
                    this.router.navigate(['succes'], { queryParams: { Erreur: params['Erreur'], Sign: params['Sign'] } });
                  },
                  error: error => {
                    console.log("Impossible de récupérer les références de la commande: "+error.error);
                    this.router.navigate(['echec'], { queryParams: { Erreur: 'int003', Ref: this.ref || params['Ref'], Mt: params['Mt'] } });
                  }
                });
              }
            },
            error: error => {
              console.log("Impossible de vérifier la conformité du paiement.");
              this.router.navigate(['echec'], { queryParams: { Erreur: 'int004' } });
            }
          });
        } // else inutile : si erreur!=00000 ==> CA redirige vers page /echec
      } else {
        this.router.navigate(['/']);  // si acces a la page sans passer de commande
      }
    });
  }
}
