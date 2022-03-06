import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { delay } from 'rxjs';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.scss']
})
export class CoachingComponent implements OnInit {
  
  montant: string = "2500"; // changer le moyen d'appeler le montant !!
  ref: string = "abc";
  mail: string = "essai@gmail.com";
  dateTime!: string;
  hmac!: string;
  
  form!: HTMLFormElement;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.form = document.querySelector('#pay')!;
    this.form.onsubmit = () => {
      this.pay();
    }
  }

  pay(): void {
    this.dateTime = this.toIsoString(new Date());

    this.http.post<any>('/api/paiement/', {
      montant: this.montant,
      ref: this.ref,
      mail: this.mail,
      dateTime: this.dateTime
    }).subscribe({
      next: data => {
        this.hmac = data['cle'];
        console.log(this.form);
        
        

      },
      error: error => {
        console.log('Il y a eu une erreur: ' + error);
      }
    });
  }


  // Formater la date
  toIsoString(date: Date) {
    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num: any) {
            return (num < 10 ? '0' : '') + num;
        };
  
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(Math.floor(Math.abs(tzo) / 60)) +
        ':' + pad(Math.abs(tzo) % 60);
  }

}
