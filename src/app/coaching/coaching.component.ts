import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-coaching',
  templateUrl: './coaching.component.html',
  styleUrls: ['./coaching.component.scss']
})
export class CoachingComponent implements OnInit {

  date!: Date;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  pay(): void {
  }

}
