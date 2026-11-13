import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})
export class PayeeTransactionService {

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
  
    getSupplierPaymentTransCode(LoginId) : Observable<any>{
      return this.http.get<any>(_url+'getSupplierPaymentTransCode/'+LoginId, this.BranchId );
    }
    saveToSupplierPaymentHeaders(sourceTransNo,amount,  transCode, CustomerId, balance,  data) : Observable<any>{
      return this.http.post<any>(_url+'saveToSupplierPaymentHeaders/'+sourceTransNo+'/'+amount+'/'+transCode+'/'+CustomerId+'/'+balance,data, this.BranchId );
    }
    deleteSupplierPaymentDetailById(Id) : Observable<any>{
      return this.http.get<any>(_url+'deleteSupplierPaymentDetailById/'+Id, this.BranchId );
    }
    deleteSupplierPaymentDetailsByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'deleteSupplierPaymentDetailsByTransCode/'+transCode, this.BranchId );
    }
    updateElementSupplierPaymentDetail(Id, Column, Value) : Observable<any>{
      return this.http.get<any>(_url+'updateElementSupplierPaymentDetail/'+Id+'/'+Column+'/'+Value, this.BranchId );
    }
    saveAsPendingSupplierPaymentByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'saveAsPendingSupplierPaymentByTransCode/'+transCode, this.BranchId );
    }
    backToOngoingSupplierPaymentByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'backToOngoingSupplierPaymentByTransCode/'+transCode, this.BranchId );
    }
    deleteAllSupplierPaymentPending() : Observable<any>{
      return this.http.get<any>(_url+'deleteAllSupplierPaymentPending', this.BranchId );
    }
}
