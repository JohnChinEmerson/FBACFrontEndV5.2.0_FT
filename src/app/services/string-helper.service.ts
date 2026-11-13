import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringHelperService {

  constructor() { }

  allCategoryCBO(){
    var a:any ={
      'Category' : 'All',
    };
    return a;
  }

  allItemNameCBO(){
    var a:any ={
      'ItemName' : 'All',
      'ItemId' : 'All',
    };
    return a;
  }  
  allCustomerNameCBO(){
    var a:any ={
      'CustomerName' : 'All',
      'CustomerId' : 'All',
    };
    return a;
  }
  allSupplierNameCBO(){
    var a:any ={
      'SupplierName' : 'All',
      'SupplierId' : 'All',
    };
    return a;
  }
  allAccountTitleCBO(){
    var a:any ={
      'AccountTitle' : 'All',
    };
    return a;
  }
  all(){
    var a:any ={
      'Label' : 'All',
      'Value' : 'All',
    };
    return a;
  }

  allReasonNameCBO(){
    var a:any ={
      'ReasonName' : 'All',
      'ReasonId' : 'All',
    };
    return a;
  }



  withCASHCustomerCBO(){
    var a:any ={
      'CustomerId' : 'CASH',
      'CustomerName' : 'CASH',
    };
    return a;
  }


  withCASHSupplierCBO(){
    var a:any ={
      'SupplierId' : 'CASH',
      'SupplierName' : 'CASH',
    };
    return a;
  }

  withCASHPayeeCBO(){
    var a:any ={
      'PayeeId' : 'CASH',
      'PayeeName' : 'CASH',
    };
    return a;
  }

  withNAExpiryDateCBO(){
    var a:any ={
      'ExpiryDate' : 'NA',
      'ExpiryDate2' : 'NA',
      'BatchLotNo' : 'NA',
      'Qty' : '0.00',
      'id' : 0,
    };
    return a;
  }
}
