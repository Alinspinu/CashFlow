import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { Preferences } from '@capacitor/preferences';



@Injectable({providedIn: 'root'})



export class ConfigService{

  url: string = 'https://cafetish-server.ew.r.appspot.com/'
  locatie!: string

  constructor(
    private http: HttpClient,
  ){
    // this.getUrl()
  }

  // async getUrl(){
  //   Preferences.get({key: 'serverUrl'}).then( async (data)  => {
  //     if(data.value) {
  //       this.url = data.value
  //     }
  //   })
  // }


  fetchLocatie(locId: string){
    const  headers: HttpHeaders = new HttpHeaders({
      'bypass-tunnel-reminder': 'true'
    });
    return this.http.get(`${this.url}users/loc?id=${locId}`, {headers})
  }

  saveServiceMail(email: string, appKey: string, locId: string ){
    const  headers: HttpHeaders = new HttpHeaders({
      'bypass-tunnel-reminder': 'true'
    });
    return this.http.put<{message: string}>(`${this.url}users/loc`, {email, appKey, locId}, {headers})
  }

}
