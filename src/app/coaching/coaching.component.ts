import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.scss']
})
export class CoachingComponent implements OnInit {
  ref: string = "almado-ac-coaching";
  mail: string = "essai@gmail.com";
  dateTime!: string;
  montant!: string;
  hmac!: string;
  
  form!: HTMLFormElement;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  pay(): void {
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
        console.log('Il y a eu une erreur: ' + error);
      }
    });
  }
}
