import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SaleHeadersService {

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

  // the saved sale, or the pending one built from its lines (temporary TransNo, no header yet)
  getSaleOrPending(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getSaleOrPending/'+transNo, this.BranchId );
  }

  getSaleHeaderByRecordStatusByInputBy(recordStatus, inputBy) : Observable<any>{
    return this.http.get<any>(_url+'getSaleHeaderByRecordStatusByInputBy/'+recordStatus+'/'+inputBy, this.BranchId );
  }
  
  getSaleHeaderByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getSaleHeaderByTransNo/'+transNo, this.BranchId );
  }

  getSaleHeadersByRecordStatus(recordStatus) : Observable<any>{
    return this.http.get<any>(_url+'getSaleHeadersByRecordStatus/'+recordStatus, this.BranchId );
  }
  getSaleHeaderComputedAmounts(data) : Observable<any>{
    return this.http.post<any>(_url+'getSaleHeaderComputedAmounts',data, this.BranchId );
  }
  updateSaleHeader(transNo, totalAmount, oHeader, recordStatusCashiering, action,saleHeaderForm) : Observable<any>{
    return this.http.post<any>(_url+'updateSaleHeader/'+transNo+'/'+totalAmount+'/'+oHeader+'/'+recordStatusCashiering+'/'+action,saleHeaderForm, this.BranchId );
  }
  getSaleHeadersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getSaleHeadersByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  getDataPendingCashiering() : Observable<any>{
    return this.http.get<any>(_url+'getDataPendingCashiering', this.BranchId );
  }
  getSaleHeadersToBeDeliveredByDateFromByDateToByWithDate(dateFrom, dateTo, withDate) : Observable<any>{
    return this.http.get<any>(_url+'getSaleHeadersToBeDeliveredByDateFromByDateToByWithDate/'+dateFrom+'/'+dateTo+'/'+withDate, this.BranchId );
  }
  updateVoidReason(data, transNo) : Observable<any>{
    return this.http.post<any>(_url+'updateVoidReason/'+transNo,data, this.BranchId );
  }
  // header, lines, discounts and permits of a saved sale for the receipt re-print
  getSaleReceiptForPrint(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReceiptForPrint/'+transNo, this.BranchId );
  }
  updateSaleRecordStatus(transNo, action) : Observable<any>{
    return this.http.get<any>(_url+'updateSaleRecordStatus/'+transNo+'/'+action, this.BranchId );
  }
  updateSaleHeaderFromSalesCashiering(data, transNo) : Observable<any>{
    return this.http.post<any>(_url+'updateSaleHeaderFromSalesCashiering/'+transNo,data, this.BranchId );
  }
}
