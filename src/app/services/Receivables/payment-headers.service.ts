import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentHeadersService {

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
  
    getPaymentHeaderByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'getPaymentHeaderByTransCode/'+transCode, this.BranchId );
    }
    getPaymentHeaderByRecordStatusByInputBy(recordStatus, inputBy) : Observable<any>{
      return this.http.get<any>(_url+'getPaymentHeaderByRecordStatusByInputBy/'+recordStatus+'/'+inputBy, this.BranchId );
    }
    getPaymentHeaderByTransNo(transNo) : Observable<any>{
      return this.http.get<any>(_url+'getPaymentHeaderByTransNo/'+transNo, this.BranchId );
    }
  
    getPaymentHeadersByRecordStatus(recordStatus) : Observable<any>{
      return this.http.get<any>(_url+'getPaymentHeadersByRecordStatus/'+recordStatus, this.BranchId );
    }
    getPaymentHeaderComputedAmounts(data) : Observable<any>{
      return this.http.post<any>(_url+'getPaymentHeaderComputedAmounts',data, this.BranchId );
    }
    updatePaymentHeader(transCode, totalAmount,  action,saleHeaderForm) : Observable<any>{
      return this.http.post<any>(_url+'updatePaymentHeader/'+transCode+'/'+totalAmount+'/'+action,saleHeaderForm, this.BranchId );
    }
    getPaymentHeadersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
      return this.http.get<any>(_url+'getPaymentHeadersByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
    }
   
    updateVoidReason(data, transNo) : Observable<any>{
      return this.http.post<any>(_url+'updateVoidReason/'+transNo,data, this.BranchId );
    }
    updatePaymentRecordStatus(transNo, action) : Observable<any>{
      return this.http.get<any>(_url+'updatePaymentRecordStatus/'+transNo+'/'+action, this.BranchId );
    }
}
