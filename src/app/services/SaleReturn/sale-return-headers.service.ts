import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SaleReturnHeadersService {

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

  getSaleReturnHeaderByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnHeaderByTransCode/'+transCode, this.BranchId );
  }
  getSaleReturnHeaderByRecordStatusByInputBy(recordStatus, inputBy) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnHeaderByRecordStatusByInputBy/'+recordStatus+'/'+inputBy, this.BranchId );
  }
  getSaleReturnHeaderByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnHeaderByTransNo/'+transNo, this.BranchId );
  }
  getSaleReturnHeadersByRecordStatus(recordStatus) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnHeadersByRecordStatus/'+recordStatus, this.BranchId );
  }
  // header, lines and permits of a saved sales return for the POS receipt (re-print)
  getSaleReturnReceiptForPrint(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnReceiptForPrint/'+transNo, this.BranchId );
  }
  getSaleReturnHeaderComputedAmounts(data) : Observable<any>{
    return this.http.post<any>(_url+'getSaleReturnHeaderComputedAmounts',data, this.BranchId );
  }
  updateSaleReturnHeader(transCode, totalAmount, recordStatus, action,saleHeaderForm) : Observable<any>{
    return this.http.post<any>(_url+'updateSaleReturnHeader/'+transCode+'/'+totalAmount+'/'+recordStatus+'/'+action,saleHeaderForm, this.BranchId );
  }
  getSaleReturnHeadersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnHeadersByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  updateSaleReturnRecordStatus(transNo, action) : Observable<any>{
    return this.http.get<any>(_url+'updateSaleReturnRecordStatus/'+transNo+'/'+action, this.BranchId );
  }
  computeRefundable(transCode) : Observable<any>{
    return this.http.get<any>(_url+'computeRefundable/'+transCode, this.BranchId );
  }
}
