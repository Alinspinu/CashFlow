import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input  } from '@angular/core';
import { Capacitor } from '@capacitor/core'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { IonicModule, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';


@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]

})
export class ImagePickerComponent implements OnInit {

@ViewChild('filePicker') filePickerRef!: ElementRef<HTMLInputElement>
@Output() imagePick = new EventEmitter<string | File>()
@Input() showPreview = false

usePicker = false
@Input() selectedImage: string = 'https://cdn11.bigcommerce.com/s-4f830/stencil/21634b10-fa2b-013a-00f1-62a1dd733893/e/4a0532a0-6207-013b-8ab2-261f9b1f5b00/icons/icon-no-image.svg'

  constructor(private platform: Platform) { }

  ngOnInit() {
    // console.log('mobile', this.platform.is('mobile'));
    // console.log('hybrid', this.platform.is('hybrid'));
    // console.log('ios', this.platform.is('ios'));
    // console.log('android', this.platform.is('android'));
    // console.log('desktop', this.platform.is('desktop'));
    if((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')){
      this.usePicker = true;
    };

  };

onPickImage(){
  if(!Capacitor.isPluginAvailable('Camera')){
    this.filePickerRef.nativeElement.click();
    return;
   } else {
    Camera.getPhoto({
    quality: 50,
    source: CameraSource.Prompt,
    correctOrientation: true,
    height: 320,
    width: 200,
    resultType: CameraResultType.DataUrl
   }).then(image => {
    this.selectedImage = image.dataUrl ?? '';
    this.imagePick.emit(image.dataUrl);
   }).catch(err=>{
    console.log(err);
    if(this.usePicker){
      this.filePickerRef.nativeElement.click();
    }
    return false;
   });
};
};
onFileChosen(event: Event){
  const pickedFile = (event.target as HTMLInputElement | null)?.files?.[0];
  if(!pickedFile){
    return;
  }
  const fr = new FileReader();
  fr.readAsDataURL(pickedFile);
  fr.onload = () => {
    const dataUrl = fr.result!.toString();
    this.selectedImage = dataUrl;
    this.imagePick.emit(pickedFile);
  };
};

};









