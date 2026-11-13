import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReturnToSupplierHeadersService {

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
  
    getReturnToSupplierHeaderByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'getReturnToSupplierHeaderByTransCode/'+transCode, this.BranchId );
    }
    getReturnToSupplierHeaderByRecordStatusByInputBy(recordStatus, inputBy) : Observable<any>{
      return this.http.get<any>(_url+'getReturnToSupplierHeaderByRecordStatusByInputBy/'+recordStatus+'/'+inputBy, this.BranchId );
    }
    getReturnToSupplierHeaderByTransNo(transNo) : Observable<any>{
      return this.http.get<any>(_url+'getReturnToSupplierHeaderByTransNo/'+transNo, this.BranchId );
    }
    getReturnToSupplierHeadersByRecordStatus(recordStatus) : Observable<any>{
      return this.http.get<any>(_url+'getReturnToSupplierHeadersByRecordStatus/'+recordStatus, this.BranchId );
    }
    getReturnToSupplierHeaderComputedAmounts(data) : Observable<any>{
      return this.http.post<any>(_url+'getReturnToSupplierHeaderComputedAmounts',data, this.BranchId );
    }
    updateReturnToSupplierHeader(transCode, totalAmount, recordStatus, action,saleHeaderForm) : Observable<any>{
      return this.http.post<any>(_url+'updateReturnToSupplierHeader/'+transCode+'/'+totalAmount+'/'+recordStatus+'/'+action,saleHeaderForm, this.BranchId );
    }
    getReturnToSupplierHeadersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
      return this.http.get<any>(_url+'getReturnToSupplierHeadersByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
    }
    updateReturnToSupplierRecordStatus(transNo, action) : Observable<any>{
      return this.http.get<any>(_url+'updateReturnToSupplierRecordStatus/'+transNo+'/'+action, this.BranchId );
    }
}
