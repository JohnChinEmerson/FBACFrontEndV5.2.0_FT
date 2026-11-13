import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class MultiplePaymentHeadersService {
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
    computeMultiplePaymentsByTransCodeByColumnFilter(transCode, columnFilter) : Observable<any>{
      return this.http.get<any>(_url+'computeMultiplePaymentsByTransCodeByColumnFilter/'+transCode+'/'+columnFilter, this.BranchId );
    }
    getMultiplePaymentsBySourceTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'getMultiplePaymentsBySourceTransCode/'+transCode, this.BranchId );
    }
    updateMultiplePaymentHeaderRecordStatus(id, recordStatus) : Observable<any>{
      return this.http.get<any>(_url+'updateMultiplePaymentHeaderRecordStatus/'+id+'/'+recordStatus, this.BranchId );
    }
    updateMultiplePaymentHeaderFromReceipt(transCode, transNo,transName) : Observable<any>{
      return this.http.get<any>(_url+'updateMultiplePaymentHeaderFromReceipt/'+transCode+'/'+transNo+'/'+transName, this.BranchId );
    }
    saveMultiplePaymentHeader(btnText, data) : Observable<any>{
      return this.http.post<any>(_url+'saveMultiplePaymentHeader/'+btnText,data, this.BranchId );
    }
    deleteMultiplePaymentsBySourceTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'deleteMultiplePaymentsBySourceTransCode/'+transCode, this.BranchId );
    }
}
