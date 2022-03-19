import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-echec',
  templateUrl: './echec.component.html',
  styleUrls: ['./echec.component.scss']
})
export class EchecComponent implements OnInit {

  nom_complet!: string;
  error_code!: string;
  ref!: string;
  montant!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('token') == undefined) {
      this.router.navigate(['/']);
    }

    this.nom_complet = JSON.parse(localStorage.getItem('auth')!).name;
    this.route.queryParams.subscribe(params => {
      this.error_code = params['Erreur'];
      this.ref = params['Ref'];
      this.montant = (params['Mt'] / 100).toString();
    })
  }

}
