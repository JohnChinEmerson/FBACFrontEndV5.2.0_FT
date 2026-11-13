import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentDetailsService {

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
  
    getPaymentDetailsByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'getPaymentDetailsByTransCode/'+transCode, this.BranchId );
    }
    getPendingTransNosByCustomerId(customerId) : Observable<any>{
      return this.http.get<any>(_url+'getPendingTransNosByCustomerId/'+customerId, this.BranchId );
    }
    getPaymentDetailById(id) : Observable<any>{
      return this.http.get<any>(_url+'getPaymentDetailById/'+id, this.BranchId );
    }
    updatePaymentDetail(data, action) : Observable<any>{
      return this.http.post<any>(_url+'updatePaymentDetail/'+action,data, this.BranchId );
    }
    computePaymentDetailAmount(price, discountValue, qty, discountType, vATType) : Observable<any>{
      return this.http.get<any>(_url+'computePaymentDetailAmount/'+price+'/'+discountValue+'/'+qty+'/'+discountType+'/'+vATType, this.BranchId );
    }
    getPaymentDetailsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
      return this.http.get<any>(_url+'getPaymentDetailsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
    }
    getPaymentDetailsByTransNo(transNo) : Observable<any>{
      return this.http.get<any>(_url+'getPaymentDetailsByTransNo/'+transNo, this.BranchId );
    }
    updatePaymentDetailRecordStatus(id, action) : Observable<any>{
      return this.http.get<any>(_url+'updatePaymentDetailRecordStatus/'+id+'/'+action, this.BranchId );
    }
}
