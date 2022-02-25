import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ErrPageComponent } from './err-page/err-page.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: 'contact', component: ContactComponent },
      { path: '', component: HomeComponent },
      { path: '404', component: ErrPageComponent},
      { path: '**', redirectTo: '/404'}
    ])
  ],
  providers: [],
  bootstrap: [
    AppComponent,
    HomeComponent,
    ErrPageComponent
  ]
})
export class AppModule { }
