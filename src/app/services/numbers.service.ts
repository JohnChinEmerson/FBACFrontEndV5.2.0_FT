import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumbersService {

  constructor() { }

  ConvertToNumberFormatWithComma(x:any){
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  ConvertToNumberFormatNoComma(x:any){
    var z = (Number(x.replaceAll(",","")));
    return z;
  }

  Convert2Decimal(x: any) {
    x = Number(x);
    return x.toFixed(2);
  }
  Convert4Decimal(x: any) {
    x = Number(x);
    return x.toFixed(4);
  }
  Convert0Decimal(x: any) {
    x = Number(x);
    return x.toFixed(0);
  }

  isNotNumeric(data:string) 
  {
    var number = data.replace(',','');
    if (isNaN(Number(number)))
    {
        return true;
    }
    return false;
  }

  isNotGreaterThanOrEqualToZero(x) {
    x = Number(x);
    if (!(x >= 0))
    {
        return true;
    }
    return false;
  }
  AmountPaidIsLessThan(x,y) {
    x = Number(x);
    y = Number(y);
    if (x < y)
    {
        return true;
    }
    return false;
  }

  
  isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }


}
