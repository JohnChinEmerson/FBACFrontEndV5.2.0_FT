import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentTransactionService {

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
  
    getPaymentTransCode(LoginId) : Observable<any>{
      return this.http.get<any>(_url+'getPaymentTransCode/'+LoginId, this.BranchId );
    }
    saveToPaymentHeaders(sourceTransNo,amount,  transCode, CustomerId, balance,  data) : Observable<any>{
      return this.http.post<any>(_url+'saveToPaymentHeaders/'+sourceTransNo+'/'+amount+'/'+transCode+'/'+CustomerId+'/'+balance,data, this.BranchId );
    }
    deletePaymentDetailById(Id) : Observable<any>{
      return this.http.get<any>(_url+'deletePaymentDetailById/'+Id, this.BranchId );
    }
    deletePaymentDetailsByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'deletePaymentDetailsByTransCode/'+transCode, this.BranchId );
    }
    updateElementPaymentDetail(Id, Column, Value) : Observable<any>{
      return this.http.get<any>(_url+'updateElementPaymentDetail/'+Id+'/'+Column+'/'+Value, this.BranchId );
    }
    saveAsPendingPaymentByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'saveAsPendingPaymentByTransCode/'+transCode, this.BranchId );
    }
    backToOngoingPaymentByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'backToOngoingPaymentByTransCode/'+transCode, this.BranchId );
    }
    deleteAllPaymentPending() : Observable<any>{
      return this.http.get<any>(_url+'deleteAllPaymentPending', this.BranchId );
    }
  
}
