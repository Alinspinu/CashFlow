import { ToastController } from "@ionic/angular";


export async function  showToast(toastCtrl: ToastController, message: string, duration: number) {
  const toast = await toastCtrl.create({
    message: message,
    duration: duration
  });
  toast.present();
}


export function  triggerEscapeKeyPress() {
  const escapeKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });
  document.dispatchEvent(escapeKeyEvent);
}


