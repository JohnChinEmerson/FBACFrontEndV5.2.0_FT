import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CashDrawersService {

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

  GetOpenCashDrawerByUserId(userId) : Observable<any>{
    return this.http.get<any>(_url+'GetOpenCashDrawerByUserId/'+userId,this.BranchId);
  }
  getCashDrawerByReadingNo(readingNo) : Observable<any>{
    return this.http.get<any>(_url+'getCashDrawerByReadingNo/'+readingNo,this.BranchId);
  }
  getTotalByCashDrawer(cashDrawer) : Observable<any>{
    return this.http.post<any>(_url+'getTotalByCashDrawer',cashDrawer,this.BranchId);
  }
  getTotalAmountIn(readingNo, paymentType) : Observable<any>{
    return this.http.get<any>(_url+'getTotalAmountIn/'+readingNo+'/'+paymentType,this.BranchId);
  }
  getTotalAmountOut(readingNo, paymentType) : Observable<any>{
    return this.http.get<any>(_url+'getTotalAmountOut/'+readingNo+'/'+paymentType,this.BranchId);
  }
  getTotalChargeIn(readingNo, paymentType) : Observable<any>{
    return this.http.get<any>(_url+'getTotalChargeIn/'+readingNo+'/'+paymentType,this.BranchId);
  }
  getTotalChargeOut(readingNo, paymentType) : Observable<any>{
    return this.http.get<any>(_url+'getTotalChargeOut/'+readingNo+'/'+paymentType,this.BranchId);
  }
  getSalesByPaymentTypes(readingNo) : Observable<any>{
    return this.http.get<any>(_url+'getSalesByPaymentTypes/'+readingNo,this.BranchId);
  }
  getSalesBreakdownBankDeposits(readingNo) : Observable<any>{
    return this.http.get<any>(_url+'getSalesBreakdownBankDeposits/'+readingNo,this.BranchId);
  }
  updateStartUpCash(data) : Observable<any>{
    return this.http.post<any>(_url+'updateStartUpCash',data,this.BranchId);
  }
  updateStartUpCashRecordStatus(readingNo, startUpCash, RecordStatus) : Observable<any>{
    return this.http.get<any>(_url+'updateStartUpCashRecordStatus/'+readingNo+'/'+startUpCash+'/'+RecordStatus,this.BranchId);
  }
  
  closCashDrawer(readingNo) : Observable<any>{
    return this.http.get<any>(_url+'closCashDrawer/'+readingNo,this.BranchId);
  }
  closeDrawerExcept(readingNo) : Observable<any>{
    return this.http.get<any>(_url+'closeDrawerExcept/'+readingNo,this.BranchId);
  }
  startCashdrawer() : Observable<any>{
    return this.http.get<any>(_url+'startCashdrawer',this.BranchId);
  }

  getCashReadingByDateFromByDateToByDepositStatus(dateFrom, dateTo, depositStatus,withdate) : Observable<any>{
    return this.http.get<any>(_url+'getCashReadingByDateFromByDateToByDepositStatus/'+dateFrom+'/'+dateTo+'/'+depositStatus+'/'+withdate, this.BranchId );
  }
  
}
