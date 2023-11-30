import { FormGroup } from '@angular/forms';

export function matchingPasswordsValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ passwordsMismatch: true });
    } else {
      matchingControl.setErrors(null);
    };
  };
};
