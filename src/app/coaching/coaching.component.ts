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

  
  addToCart(): void {
    let thisClientToken = localStorage.getItem('token');

    localStorage.setItem('panier', JSON.stringify([
      {
        token: thisClientToken,
        ref: 'almado-ac-coaching',
        prix: '25'
      }
    ]));
    console.log(localStorage.getItem('panier'));
    this.router.navigate(['panier']);
  }
}
