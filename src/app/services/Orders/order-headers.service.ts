import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderHeadersService {

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
  
    getOrderHeaderByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'getOrderHeaderByTransCode/'+transCode, this.BranchId );
    }
    
    getOrderHeaderByTransNo(transNo) : Observable<any>{
      return this.http.get<any>(_url+'getOrderHeaderByTransNo/'+transNo, this.BranchId );
    }
  
    getOrderHeadersByRecordStatus(recordStatus) : Observable<any>{
      return this.http.get<any>(_url+'getOrderHeadersByRecordStatus/'+recordStatus, this.BranchId );
    }

    getOrderHeaderByRecordStatusByInputBy(recordStatus, inputBy) : Observable<any>{
      return this.http.get<any>(_url+'getOrderHeaderByRecordStatusByInputBy/'+recordStatus+'/'+inputBy, this.BranchId );
    }

    getOrderHeaderComputedAmounts(data) : Observable<any>{
      return this.http.post<any>(_url+'getOrderHeaderComputedAmounts',data, this.BranchId );
    }
    updateOrderHeader(transCode, totalAmount, btnText,saleHeaderForm) : Observable<any>{
      return this.http.post<any>(_url+'updateOrderHeader/'+transCode+'/'+totalAmount+'/'+btnText,saleHeaderForm, this.BranchId );
    }
    getOrderHeadersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
      return this.http.get<any>(_url+'getOrderHeadersByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
    }
    getOrderHeadersUndelivered() : Observable<any>{
      return this.http.get<any>(_url+'getOrderHeadersUndelivered', this.BranchId );
    }

    updateOrderRecordStatus(transNo, action) : Observable<any>{
      return this.http.get<any>(_url+'updateOrderRecordStatus/'+transNo+'/'+action, this.BranchId );
    }
    updateOrderHeaderFromOrdersCashiering(data, transNo) : Observable<any>{
      return this.http.post<any>(_url+'updateOrderHeaderFromOrdersCashiering/'+transNo,data, this.BranchId );
    }
}
