import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class StockAdjustmentHeadersService {

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
  
    getStockAdjustmentHeaderByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'getStockAdjustmentHeaderByTransCode/'+transCode, this.BranchId );
    }
    getStockAdjustmentHeaderByRecordStatusByInputByByAdjustmentType(recordStatus, inputBy, adjustmentType) : Observable<any>{
      return this.http.get<any>(_url+'getStockAdjustmentHeaderByRecordStatusByInputByByAdjustmentType/'+recordStatus+'/'+inputBy+'/'+adjustmentType, this.BranchId );
    }
    getStockAdjustmentHeaderByTransNo(transNo) : Observable<any>{
      return this.http.get<any>(_url+'getStockAdjustmentHeaderByTransNo/'+transNo, this.BranchId );
    }
    getStockAdjustmentHeadersByRecordStatusByAdjustmentType(adjustmentType, recordStatus) : Observable<any>{
      return this.http.get<any>(_url+'getStockAdjustmentHeadersByRecordStatusByAdjustmentType/'+adjustmentType+'/'+recordStatus, this.BranchId );
    }
    getStockAdjustmentHeadersPendingTransfer() : Observable<any>{

      return this.http.get<any>(_url+'getStockAdjustmentHeadersPendingTransfer/'+this.auth.Branch.BranchId, this.BranchId );
    }
    getStockAdjustmentHeaderComputedAmounts(data) : Observable<any>{
      return this.http.post<any>(_url+'getStockAdjustmentHeaderComputedAmounts',data, this.BranchId );
    }
    updateStockAdjustmentHeader(transCode, totalAmount, oHeader, recordStatus, action,saleHeaderForm) : Observable<any>{
      return this.http.post<any>(_url+'updateStockAdjustmentHeader/'+transCode+'/'+totalAmount+'/'+oHeader+'/'+recordStatus+'/'+action,saleHeaderForm, this.BranchId );
    }
    getStockAdjustmentHeadersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
      return this.http.get<any>(_url+'getStockAdjustmentHeadersByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
    }
    updateStockAdjustmentRecordStatus(transNo, action) : Observable<any>{
      return this.http.get<any>(_url+'updateStockAdjustmentRecordStatus/'+transNo+'/'+action, this.BranchId );
    }
}
