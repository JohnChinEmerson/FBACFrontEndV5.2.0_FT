import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SalesTransactionService {

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

  get RequiredRefresh(){
    return this._refreshrequired;
  }

  // Desktop LoadPendingTransaction: the cashier's pending counter sale (temporary TransNo) or null
  getPendingSaleTransNo() : Observable<any>{
    return this.http.get<any>(_url+'getPendingSaleTransNo', this.BranchId );
  }
  getPendingSales() : Observable<any>{
    return this.http.get<any>(_url+'getPendingSales', this.BranchId );
  }
  
  // restaurant: { TableId, OrderType } also tags the line (table / kitchen printer / Set) in the same request;
  // the reply then carries saleDetails (the order's lines) and always the item's available qty
  // transNo: the pending sale's temporary TransNo, or null for a new one (the reply has the new transNo)
  saveToSaleHeaders(ItemId,qty,  transNo, CustomerId, price,um,priceCategory,  recordStatusCashiering, restaurant: any = null) : Observable<any>{
    var query = restaurant
      ? '?restaurant=1&TableId=' + encodeURIComponent(restaurant.TableId ?? '') + '&OrderType=' + encodeURIComponent(restaurant.OrderType ?? '')
      : '';
    return this.http.get<any>(_url+'saveToSaleHeaders/'+ItemId+'/'+qty+'/'+(transNo || 'new')+'/'+CustomerId+'/'+price+'/'+um+'/'+priceCategory+'/'+recordStatusCashiering + query, this.BranchId );
  }
  deleteSaleDetailById(Id) : Observable<any>{
    return this.http.get<any>(_url+'deleteSaleDetailById/'+Id, this.BranchId );
  }
  cancelPendingSale(transNo) : Observable<any>{
    return this.http.get<any>(_url+'cancelPendingSale/'+transNo, this.BranchId );
  }
  updateElementSaleDetail(Id, Column, Value) : Observable<any>{
    return this.http.get<any>(_url+'updateElementSaleDetail/'+Id+'/'+Column+'/'+Value, this.BranchId );
  }
  overrideSaleCustomer(transNo, customerId) : Observable<any>{
    return this.http.get<any>(_url+'overrideSaleCustomer/'+transNo+'/'+customerId, this.BranchId );
  }
  resumePendingSale(transNo) : Observable<any>{
    return this.http.get<any>(_url+'resumePendingSale/'+transNo, this.BranchId );
  }
  deleteAllSaleHeadersPending() : Observable<any>{
    return this.http.get<any>(_url+'deleteAllSaleHeadersPending', this.BranchId );
  }
  loadSO(data) : Observable<any>{
    return this.http.post<any>(_url+'loadSO',data, this.BranchId );
  }
 

 
}
