import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { WebRTCService } from '../content/webRTC.service';
import { ActionSheetService } from './action-sheet.service';

@Injectable({
  providedIn: 'root',
})


export class IncommingOrdersService {


  constructor(
    private http: HttpClient,
    private webRTC: WebRTCService,
    @Inject(ActionSheetService) actionSheer: ActionSheetService
  ) {}



  getOrder(orderId: string){

  }


}
