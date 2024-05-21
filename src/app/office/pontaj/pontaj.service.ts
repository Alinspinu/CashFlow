import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import {environment} from '../../../environments/environment'
import { Pontaj } from '../../models/shedule.model';



@Injectable({providedIn: 'root'})


export class PontajService{


  constructor(
    private http: HttpClient,
  ){

  }


  getLastPontaj(){
    return this.http.get<Pontaj>(`${environment.BASE_URL}shedule/pontaj?loc=${environment.LOC}&pont=last`)
  }



}
