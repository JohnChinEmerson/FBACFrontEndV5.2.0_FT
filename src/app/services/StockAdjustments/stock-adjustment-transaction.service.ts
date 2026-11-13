import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class StockAdjustmentTransactionService {

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
  
    getStockAdjustmentTransCodeByAdjustmentType( LoginId, adjustmentType) : Observable<any>{
      return this.http.get<any>(_url+'getStockAdjustmentTransCodeByAdjustmentType/'+LoginId+'/'+adjustmentType, this.BranchId );
    }
    
    saveToStockAdjustmentHeaders(adjustmentType,ItemId, qty, transCode, CustomerId, price, um, recordStatus) : Observable<any>{
      return this.http.get<any>(_url+'saveToStockAdjustmentHeaders/'+adjustmentType+'/'+ItemId+'/'+qty+'/'+transCode+'/'+CustomerId+'/'+price+'/'+um+'/'+recordStatus, this.BranchId );
    }
    deleteStockAdjustmentDetailById(Id) : Observable<any>{
      return this.http.get<any>(_url+'deleteStockAdjustmentDetailById/'+Id, this.BranchId );
    }
    deleteStockAdjustmentDetailsByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'deleteStockAdjustmentDetailsByTransCode/'+transCode, this.BranchId );
    }
    updateElementStockAdjustmentDetail(Id, Column, Value) : Observable<any>{
      return this.http.get<any>(_url+'updateElementStockAdjustmentDetail/'+Id+'/'+Column+'/'+Value, this.BranchId );
    }
    saveAsPendingStockAdjustmentByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'saveAsPendingStockAdjustmentByTransCode/'+transCode, this.BranchId );
    }
    overrideStockAdjustmentReasonByTransCode(transCode, supplierId) : Observable<any>{
      return this.http.get<any>(_url+'overrideStockAdjustmentReasonByTransCode/'+transCode+'/'+supplierId, this.BranchId );
    }
    backToOngoingStockAdjustmentByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'backToOngoingStockAdjustmentByTransCode/'+transCode, this.BranchId );
    }
    deleteAllStockAdjustmentHeadersPending() : Observable<any>{
      return this.http.get<any>(_url+'deleteAllStockAdjustmentHeadersPending', this.BranchId );
    }
    stockInRecordByTransNoByBranchId(prevTransCode, transNo, fromBranchId) : Observable<any>{
      return this.http.get<any>(_url+'stockInRecordByTransNoByBranchId/'+prevTransCode+'/'+transNo+'/'+fromBranchId, this.BranchId );
    }
    closeStockAdjustmentHeaderByTransNoByBranchId(transNo, fromBranchId) : Observable<any>{
      return this.http.get<any>(_url+'closeStockAdjustmentHeaderByTransNoByBranchId/'+transNo+'/'+fromBranchId, this.BranchId );
    }
}
