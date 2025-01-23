import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
declare const cloudinary: any;

interface image{
  filename: string,
  path: string
}

@Component({
  selector: 'app-cloudinary-picker',
  templateUrl: './cloudinary-picker.page.html',
  styleUrls: ['./cloudinary-picker.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CloudinaryPickerPage implements OnInit {

  uploadedImageUrl: string | null = null;

 @Input() images: image[] = [{filename: '23', path:'https://res.cloudinary.com/dhetxk68c/image/upload/v1737627000/cas-flow/m3x6fmzumxxzsgqczjoz.jpg'}]

 @Output() imagesToSend = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }


  deleteImage(index: number){
    this.images.splice(index, 1)
    this.imagesToSend.emit(this.images)
  }


  openUploadWidget(): void {
    const cloudName = 'dhetxk68c'; 
    const uploadPreset = 'cash_flow'; 

    cloudinary.openUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local', 'url', 'camera', 'google_drive', 'dropbox', 'shutterstock', 'unsplash'],
        multiple: false,
        cropping: true, 
        showAdvancedOptions: false,
        styles: {
          palette: {
            window: 'rgb(189, 255, 243)',       
            sourceBg: 'rgb(238, 225, 199)',     
            windowBorder: 'rgb(88, 88, 88)', 
            tabIcon: 'rgb(175, 80, 2)',        
            inactiveTabIcon: 'rgb(147, 132, 110)', 
            menuIcons: 'rgb(145, 123, 102)',       
            textDark: 'rgb(48, 48, 48)',          
            textLight: 'rgb(255, 255, 255)',    
            link: 'rgb(60, 139, 176)',           
            action: 'rgb(255, 98, 12)',       
            inProgress: 'rgb(0, 120, 255)',    
            complete: 'rgb(42, 191, 60)',       
            error: 'rgb(245, 84, 84)'          
        }
        }
      },
      (error: any, result: any) => {
        if (!error && result?.event === 'success') {
          console.log('Upload successful:', result.info);
          const image: image = {
            filename: result.info.public_id,
            path: result.info.secure_url
          }
          this.images.push(image)
          this.imagesToSend.emit(this.images)
          console.log(this.images)
        } else if (error) {
          console.error('Upload error:', error);
        }
      }
    );
  }

}
