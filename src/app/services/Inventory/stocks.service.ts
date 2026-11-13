import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  private _refreshrequired=new Subject<void>();
  branch = new HttpHeaders({
    'Content-Type': 'application/json',
    'AuthBranchId': `${this.auth.Branch ? this.auth.Branch.BranchId : ""}`,
   'UserId': `${this.auth.LoginId}`,
    'Edition': `${this.auth.Edition}`,
     
    'Token': `${localStorage.getItem('SessionToken')}`
  });

  BranchId : any;
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) { 
    this.BranchId ={ headers: this.branch};
  }


  get requiredRefresh(){
    return this._refreshrequired;
  }

  getStocks() : Observable<any>{
    return this.http.get<any>(_url+'getStocks',this.BranchId);
  }
  getItemByItemId(itemId) : Observable<any>{
    return this.http.get<any>(_url+'getItemByItemId/'+itemId,this.BranchId);
  }
  getItemByBarcodeId(barcodeId) : Observable<any>{
    return this.http.get<any>(_url+'getItemByBarcodeId/'+barcodeId,this.BranchId);
  }
  
  getStocksForSaleByItemType(itemType) : Observable<any>{
    return this.http.get<any>(_url+'getStocksForSaleByItemType/'+itemType,this.BranchId);
  }
  getCBOStocksForSaleByItemType(itemType) : Observable<any>{
    return this.http.get<any>(_url+'getCBOStocksForSaleByItemType/'+itemType,this.BranchId);
  }
  getStocksForTransaction() : Observable<any>{
    return this.http.get<any>(_url+'getStocksForTransaction',this.BranchId);
  }
  getCBOOutOfStocksForTransaction() : Observable<any>{
    return this.http.get<any>(_url+'getCBOOutOfStocksForTransaction',this.BranchId);
  }
  getCBOStocksForTransaction() : Observable<any>{
    return this.http.get<any>(_url+'getCBOStocksForTransaction',this.BranchId);
  }
  recomputeStockByItemId(itemId) : Observable<any>{
    return this.http.get<any>(_url+'recomputeStockByItemId/'+itemId,this.BranchId);
  }
  updatePrice(itemId, newPrice) : Observable<any>{
    return this.http.get<any>(_url+'updatePrice/'+itemId+'/'+newPrice,this.BranchId);
  }
  repriceStocksByCustomerId(customerId, stocks) : Observable<any>{
    return this.http.post<any>(_url+'repriceStocksByCustomerId/'+customerId,stocks,this.BranchId);
  }
}
