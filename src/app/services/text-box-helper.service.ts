import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextBoxHelperService {

 IsNotNumeric(textBoxes:any)
  {
    textBoxes.forEach(x => {
      var number = x.replace(',','');
      if (isNaN(Number(number)))
      {
          return number.toUpperCase() + " should be a number.";
      }
    });
    return;
  }
}
