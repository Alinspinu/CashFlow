import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})



export class ConfigService{

  locatie!: string

  private serversState!: BehaviorSubject<any[]>;
  public serversSend$!: Observable<any[]>;
  servers: any[] = [];

  constructor(
    private http: HttpClient
  ){
    this.serversState = new BehaviorSubject<any[]>([]);
    this.serversSend$ =  this.serversState.asObservable();
  }


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

  getPrintServerss(point: string){
    return this.http.get<{servers: any[]}>(`${environment.BASE_URL}users/server?loc=${environment.LOC}&point=${point}`)
      .pipe(tap(response => {
        this.servers = response.servers
        this.serversState.next(this.servers)
      }))
  }

}
