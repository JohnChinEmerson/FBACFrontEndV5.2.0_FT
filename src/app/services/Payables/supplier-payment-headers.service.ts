import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierPaymentHeadersService {

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
  
    getSupplierPaymentHeaderByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'getSupplierPaymentHeaderByTransCode/'+transCode, this.BranchId );
    }
    getSupplierPaymentHeaderByRecordStatusByInputBy(recordStatus, inputBy) : Observable<any>{
      return this.http.get<any>(_url+'getSupplierPaymentHeaderByRecordStatusByInputBy/'+recordStatus+'/'+inputBy, this.BranchId );
    }
    getSupplierPaymentHeaderByTransNo(transNo) : Observable<any>{
      return this.http.get<any>(_url+'getSupplierPaymentHeaderByTransNo/'+transNo, this.BranchId );
    }
  
    getSupplierPaymentHeadersByRecordStatus(recordStatus) : Observable<any>{
      return this.http.get<any>(_url+'getSupplierPaymentHeadersByRecordStatus/'+recordStatus, this.BranchId );
    }
    getSupplierPaymentHeaderComputedAmounts(data) : Observable<any>{
      return this.http.post<any>(_url+'getSupplierPaymentHeaderComputedAmounts',data, this.BranchId );
    }
    updateSupplierPaymentHeader(transCode, totalAmount,  action,saleHeaderForm) : Observable<any>{
      return this.http.post<any>(_url+'updateSupplierPaymentHeader/'+transCode+'/'+totalAmount+'/'+action,saleHeaderForm, this.BranchId );
    }
    getSupplierPaymentHeadersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
      return this.http.get<any>(_url+'getSupplierPaymentHeadersByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
    }
   
    updateVoidReason(data, transNo) : Observable<any>{
      return this.http.post<any>(_url+'updateVoidReason/'+transNo,data, this.BranchId );
    }
    updateSupplierPaymentRecordStatus(transNo, action) : Observable<any>{
      return this.http.get<any>(_url+'updateSupplierPaymentRecordStatus/'+transNo+'/'+action, this.BranchId );
    }
}
