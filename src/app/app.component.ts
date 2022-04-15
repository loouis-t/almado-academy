import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'almado-academy';
  current_year = new Date().getFullYear();

  ngOnInit() {
    window.addEventListener('scroll', () => {
      let header: NodeListOf<HTMLElement> = document.querySelectorAll("header")!;
      console.log(header);

      if (window.screen.width > 768) {  // si desktop client
        // ici : header.height = 4em
        if (window.scrollY > 4*16) {
          header[0].style.background = "#1f2122";
        } else {
          header[0].style.background = "#1f212288";
        }
      } else {                          // si mobile client
        // ici : header.height = 5em
        if (window.scrollY > 5*16) {
          header[1].style.background = "#1f2122";
        } else {
          header[1].style.background = "#1f212288";
        }
      }
    });
  }

  displayMenu() {
    let checkbox = <HTMLInputElement>document.getElementById("check");
    let menu = document.getElementById("menu");
    let navBar = document.getElementById("navBar");

    if (checkbox.checked) {
      menu!.classList.add("menuOuvert");
      navBar!.classList.add("navBar");
    } else {
      menu!.classList.remove("menuOuvert");
      navBar!.classList.remove("navBar");
    }
  }
}
