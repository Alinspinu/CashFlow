import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { environment } from 'src/environments/environment';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const dbConfig: DBConfig  = {
  name: 'MyDb',
  version: 1,
  objectStoresMeta: [{
    store: 'data',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [ ]
  }]
};


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
     AppRoutingModule,
     HttpClientModule,
     provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
     provideFirestore(() => getFirestore()),
     NgxIndexedDBModule.forRoot(dbConfig),
     BrowserAnimationsModule
    ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, HttpClient],
  bootstrap: [AppComponent],

})
export class AppModule {}
