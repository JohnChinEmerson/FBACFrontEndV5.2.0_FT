import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaxHelperService {

  constructor() { }

  VATType(){
    return 'VAT Included';
  }

}
