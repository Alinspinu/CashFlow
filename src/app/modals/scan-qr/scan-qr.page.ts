import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { BrowserQRCodeReader,  IScannerControls} from '@zxing/browser';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ScanQrPage implements OnInit {

  text!: string

  constructor(
    private modalCtrl: ModalController
  ) { }



  ngOnInit() {

    this.scanQrCode()
  }

  close(){
    console.log('hit')
    this.modalCtrl.dismiss(null)
  }

  scanQrCode(){
    const callbackFn = (result: any) => {
      if(result && result.text){
        this.text = result.text
      }
    };

    const codeReader = new BrowserQRCodeReader()
    codeReader.decodeFromVideoDevice(undefined, 'video-preview', callbackFn)
    .then((scannerControls: IScannerControls) => {
      // Optionally, you can use scannerControls to stop decoding when needed
      if(this.text && this.text.length){
        this.modalCtrl.dismiss(this.text)
        scannerControls.stop();
      }
    })
    .catch((err) => {
      console.error('Error starting QR Code decoding:', err);
    });
  }

  useCode(){
    if(this.text){
      this.modalCtrl.dismiss(this.text)
    }
  }

}
