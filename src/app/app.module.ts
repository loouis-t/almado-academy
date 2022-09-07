import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { 
  SocialLoginModule,
  SocialAuthServiceConfig,
  SocialAuthService
} from 'angularx-social-login';
import { 
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ErrPageComponent } from './err-page/err-page.component';
import { ContactComponent } from './contact/contact.component';
import { ActualitesComponent } from './actualites/actualites.component';
import { AproposComponent } from './apropos/apropos.component';
import { EnconstructionComponent } from './en-construction/enconstruction.component';
import { LoginComponent } from './login/login.component';
import { CoachingComponent } from './coaching/coaching.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PanierComponent } from './panier/panier.component';
import { SuccesComponent } from './succes/succes.component';
import { EchecComponent } from './echec/echec.component';
import { ComingBackComponent } from './coming-back/coming-back.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrPageComponent,
    ActualitesComponent,
    AproposComponent,
    EnconstructionComponent,
    LoginComponent,
    CoachingComponent,
    DashboardComponent,
    PanierComponent,
    SuccesComponent,
    EchecComponent,
    ComingBackComponent
  ],
  imports: [
    BrowserModule,
    SocialLoginModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([
      // { path: 'echec', component: EchecComponent },
      // { path: 'succes', component: SuccesComponent },
      // { path: 'panier', component: PanierComponent },
      // { path: 'produits/coaching', component: CoachingComponent },
      // { path: 'produits/formation', component: EnconstructionComponent },
      // { path: 'produits/reglage', component: EnconstructionComponent },
      // { path: 'dashboard', component: DashboardComponent },
      // { path: 'login', component: LoginComponent },
      // { path: 'actu', component: EnconstructionComponent },
      // { path: 'apropos', component: AproposComponent },
      // { path: 'contact', component: ContactComponent },
      { path: '', component: ComingBackComponent },
      { path: '404', component: ErrPageComponent},
      { path: '**', redirectTo: '/404'}
    ])
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('413802590846-j47ohhj595srgcb9uh20k9im1bra73tg.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('477189533893505')
          }
        ]
      } as SocialAuthServiceConfig
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
