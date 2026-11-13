import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderTransactionService {

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
  
    getOrderTransCode(LoginId) : Observable<any>{
      return this.http.get<any>(_url+'getOrderTransCode/'+LoginId, this.BranchId );
    }
    
    saveToOrderHeaders(ItemId,qty,  transCode, CustomerId, price, um, priceCategory) : Observable<any>{
      return this.http.get<any>(_url+'saveToOrderHeaders/'+ItemId+'/'+qty+'/'+transCode+'/'+CustomerId+'/'+price+'/'+um+'/'+priceCategory, this.BranchId );
    }
    deleteOrderDetailById(Id) : Observable<any>{
      return this.http.get<any>(_url+'deleteOrderDetailById/'+Id, this.BranchId );
    }
    deleteOrderDetailsByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'deleteOrderDetailsByTransCode/'+transCode, this.BranchId );
    }
    updateElementOrderDetail(Id, Column, Value) : Observable<any>{
      return this.http.get<any>(_url+'updateElementOrderDetail/'+Id+'/'+Column+'/'+Value, this.BranchId );
    }
    saveAsPendingOrderByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'saveAsPendingOrderByTransCode/'+transCode, this.BranchId );
    }
    overrideOrderCustomerByTransCode(transCode, customerId) : Observable<any>{
      return this.http.get<any>(_url+'overrideOrderCustomerByTransCode/'+transCode+'/'+customerId, this.BranchId );
    }
    saveAsPendingOrderByTransCodeByCustomerId(transCode, customerId) : Observable<any>{
      return this.http.get<any>(_url+'saveAsPendingOrderByTransCodeByCustomerId/'+transCode+'/'+customerId, this.BranchId );
    }
    backToOngoingOrderByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'backToOngoingOrderByTransCode/'+transCode, this.BranchId );
    }
    deleteAllOrderHeadersPending() : Observable<any>{
      return this.http.get<any>(_url+'deleteAllOrderHeadersPending', this.BranchId );
    }
}
