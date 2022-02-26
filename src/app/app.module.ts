import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ErrPageComponent } from './err-page/err-page.component';
import { ContactComponent } from './contact/contact.component';
import { ActualitesComponent } from './actualites/actualites.component';
import { AproposComponent } from './apropos/apropos.component';
import { EnconstructionComponent } from './en-construction/enconstruction.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrPageComponent,
    ActualitesComponent,
    AproposComponent,
    EnconstructionComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'actu', component: EnconstructionComponent },
      { path: 'apropos', component: EnconstructionComponent },
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
    ErrPageComponent,
    EnconstructionComponent
  ]
})
export class AppModule { }
