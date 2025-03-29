import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})



export class ConfigService{

  locatie!: string

  constructor(
    private http: HttpClient,
  ){}


  fetchLocatie(){
    return this.http.get(`${environment.BASE_URL}users/loc?id=${environment.LOC}`)
  }

  saveServiceMail(email: string, appKey: string ){
    return this.http.put<{message: string}>(`${environment.BASE_URL}users/loc`, {email, appKey, locId: environment.LOC})
  }

  savePosData(ip: string, port: string){
    return this.http.post<{message: string}>(`${environment.BASE_URL}users/loc`,{ip, port, locId: environment.LOC})
  }

  savePrintServer(server: any){
    return this.http.post<{message: string, server: any}>(`${environment.BASE_URL}users/server`, {server: server})
  }

  getPrintServers(){
    return this.http.get<{servers: any[]}>(`${environment.BASE_URL}users/server?loc=${environment.LOC}&point=${environment.POINT}`)
  }

}
