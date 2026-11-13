import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class DisbursementHeadersService {

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

  getPaymentTypeFundSource(autoDisburse, VoucherRequestChecked, paymentType,TermDays1, TermDays2) : Observable<any>{
    return this.http.get<any>(_url+'getPaymentTypeFundSource/'+autoDisburse+'/'+VoucherRequestChecked+'/'+paymentType+'/'+TermDays1+'/'+TermDays2,this.BranchId);
  }
  getDisbursementHeadersByDateFromByDateToByTransName(dateFrom, dateTo, transName) : Observable<any>{
    return this.http.get<any>(_url+'getDisbursementHeadersByDateFromByDateToByTransName/'+dateFrom+'/'+dateTo+'/'+transName, this.BranchId );
  }
  getDisbursementHeaderByDisburseNo(disburseNo) : Observable<any>{
    return this.http.get<any>(_url+'getDisbursementHeaderByDisburseNo/'+disburseNo, this.BranchId );
  }
  updateDisbursementRecordStatus(transNo, action) : Observable<any>{
    return this.http.get<any>(_url+'updateDisbursementRecordStatus/'+transNo+'/'+action, this.BranchId );
  }
  
}
