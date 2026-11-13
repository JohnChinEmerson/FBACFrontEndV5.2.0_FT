import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class StockAdjustmentDetailsService {

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
  
    getStockAdjustmentDetailsByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'getStockAdjustmentDetailsByTransCode/'+transCode, this.BranchId );
    }
    getStockAdjustmentDetailById(id) : Observable<any>{
      return this.http.get<any>(_url+'getStockAdjustmentDetailById/'+id, this.BranchId );
    }
    updateStockAdjustmentDetail(data, action, adjustmentType) : Observable<any>{
      return this.http.post<any>(_url+'updateStockAdjustmentDetail/'+action+'/'+adjustmentType,data, this.BranchId );
    }
    computeStockAdjustmentDetailAmount(price, discountValue, qty, discountType) : Observable<any>{
      return this.http.get<any>(_url+'computeStockAdjustmentDetailAmount/'+price+'/'+discountValue+'/'+qty+'/'+discountType, this.BranchId );
    }
    getStockAdjustmentDetailsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
      return this.http.get<any>(_url+'getStockAdjustmentDetailsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
    }
    getStockAdjustmentDetailsByTransNo(transNo) : Observable<any>{
      return this.http.get<any>(_url+'getStockAdjustmentDetailsByTransNo/'+transNo, this.BranchId );
    }
    getStockAdjustmentDetailsReportByYearByReasonsByAdjustmentType(year,adjustmentType ) : Observable<any>{
      return this.http.get<any>(_url+'getStockAdjustmentDetailsReportByYearByReasonsByAdjustmentType/'+year+'/'+adjustmentType, this.BranchId );
    }
    getStockAdjustmentDetailsReportByYearByReasonNameByAdjustmentType(year,reasonName,adjustmentType ) : Observable<any>{
      return this.http.get<any>(_url+'getStockAdjustmentDetailsReportByYearByReasonNameByAdjustmentType/'+year+'/'+reasonName+'/'+adjustmentType, this.BranchId );
    }
    updateStockAdjustmentDetailRecordStatus(id, action) : Observable<any>{
      return this.http.get<any>(_url+'updateStockAdjustmentDetailRecordStatus/'+id+'/'+action, this.BranchId );
    }
    getStockAdjustmentDetailsPendingTransferByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'getStockAdjustmentDetailsPendingTransferByTransCode/'+transCode, this.BranchId );
    }
    getStockTransferDetailsByTransNo(transCode, adjustmentType) : Observable<any>{
      return this.http.get<any>(_url+'getStockTransferDetailsByTransNo/'+transCode+'/'+adjustmentType, this.BranchId );
    }
}
