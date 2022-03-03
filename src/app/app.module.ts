import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

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
    SocialLoginModule,
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
