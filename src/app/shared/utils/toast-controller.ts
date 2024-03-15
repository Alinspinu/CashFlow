import { ToastController } from "@ionic/angular";


export async function  showToast(toastCtrl: ToastController, message: string, duration: number, cssClass: string) {
  const toast = await toastCtrl.create({
    message: message,
    duration: duration,
    cssClass: cssClass
  });
  toast.present();
}


export function  triggerEscapeKeyPress() {
  const escapeKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });
  document.dispatchEvent(escapeKeyEvent);
}


