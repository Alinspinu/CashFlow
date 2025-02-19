import { LoadingController, ToastController } from "@ionic/angular";


export async function  showToast(toastCtrl: ToastController, message: string, duration: number) {
  const toast = await toastCtrl.create({
    message: message,
    duration: duration,
    cssClass: 'toast'
  });
  toast.present();
}


export function  triggerEscapeKeyPress() {
  const escapeKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });
  document.dispatchEvent(escapeKeyEvent);
}


export async function  showLoading(loadingCtrl: LoadingController, message: string, duration: number = 5000, cssClass: string = 'default-spinner') {
  const loading = await loadingCtrl.create({
    message,
    duration,
    cssClass,
    spinner: 'bubbles' as "bubbles" | "circles" | "circular" | "crescent" | "dots" | "lines" | "lines-small" | "lines-sharp" | "lines-sharp-small",
  });

  loading.present();
}
