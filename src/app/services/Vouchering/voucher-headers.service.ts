import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class VoucherHeadersService {

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
  
    getVoucherHeaderByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'getVoucherHeaderByTransCode/'+transCode, this.BranchId );
    }
    
    getVoucherHeaderByVoucherNo(voucherNo) : Observable<any>{
      return this.http.get<any>(_url+'getVoucherHeaderByVoucherNo/'+voucherNo, this.BranchId );
    }
    getPettyCashValue() : Observable<any>{
      return this.http.get<any>(_url+'getPettyCashValue', this.BranchId );
    }
    
    getVoucherHeadersByRecordStatus(recordStatus) : Observable<any>{
      return this.http.get<any>(_url+'getVoucherHeadersByRecordStatus/'+recordStatus, this.BranchId );
    }
   
    updateVoucherHeader(transCode, totalAmount, oHeader, recordStatusCashiering, action,saleHeaderForm) : Observable<any>{
      return this.http.post<any>(_url+'updateVoucherHeader/'+transCode+'/'+totalAmount+'/'+oHeader+'/'+recordStatusCashiering+'/'+action,saleHeaderForm, this.BranchId );
    }
    getVoucherHeadersByDateFromByDateToByTransName(dateFrom, dateTo, transName) : Observable<any>{
      return this.http.get<any>(_url+'getVoucherHeadersByDateFromByDateToByTransName/'+dateFrom+'/'+dateTo+'/'+transName, this.BranchId );
    }
    getVoucherHeadersPendingByTransName(transName) : Observable<any>{
      return this.http.get<any>(_url+'getVoucherHeadersPendingByTransName/'+transName, this.BranchId );
    }
    updateVoucherRecordStatus(transNo, action) : Observable<any>{
      return this.http.get<any>(_url+'updateVoucherRecordStatus/'+transNo+'/'+action, this.BranchId );
    }
  
}
