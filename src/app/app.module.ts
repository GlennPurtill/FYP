import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'

import { WebService } from '../services/webservice'

import { AppComponent } from './app.component'

import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { environment  } from '../environments/environment'

import { MatSnackBarModule } from '@angular/material'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatInputModule, MatButtonModule, MatIconModule, MatRadioModule, MatProgressSpinnerModule } from '@angular/material'
import { ParticlesModule } from 'angular-particle'



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, environment.googleTrans),
    AngularFireDatabaseModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    ParticlesModule,
    MatProgressSpinnerModule 
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }