import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {

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
  
    getOrderDetailsByTransCode(transCode) : Observable<any>{
      return this.http.get<any>(_url+'getOrderDetailsByTransCode/'+transCode, this.BranchId );
    }
    getOrderDetailById(id) : Observable<any>{
      return this.http.get<any>(_url+'getOrderDetailById/'+id, this.BranchId );
    }
    updateOrderDetail(data, action) : Observable<any>{
      return this.http.post<any>(_url+'updateOrderDetail/'+action,data, this.BranchId );
    }
    computeOrderDetailAmount(price, discountValue, qty, discountType, vATType) : Observable<any>{
      return this.http.get<any>(_url+'computeOrderDetailAmount/'+price+'/'+discountValue+'/'+qty+'/'+discountType+'/'+vATType, this.BranchId );
    }
    getOrderType(transCode) : Observable<any>{
      return this.http.get<any>(_url+'getOrderType/'+transCode, this.BranchId );
    }
    getOrderDetailsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
      return this.http.get<any>(_url+'getOrderDetailsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
    }
    getOrderDetailsByTransNo(transNo) : Observable<any>{
      return this.http.get<any>(_url+'getOrderDetailsByTransNo/'+transNo, this.BranchId );
    }
    getOrderDetailsForOrdersReturnByDateFromByDateToByCustomerIdWDate(dateFrom, dateTo, customerId, withDate) : Observable<any>{
      return this.http.get<any>(_url+'getOrderDetailsForOrdersReturnByDateFromByDateToByCustomerIdWDate/'+dateFrom+'/'+dateTo+'/'+customerId+'/'+withDate, this.BranchId );
    }
    getOrderDetailsReportByYearByCategory(year,category ) : Observable<any>{
      return this.http.get<any>(_url+'getOrderDetailsReportByYearByCategory/'+year+'/'+category, this.BranchId );
    }
    getOrderDetailsReportByYearByMonthByCategoryByItemId(year,month,category,itemId ) : Observable<any>{
      return this.http.get<any>(_url+'getOrderDetailsReportByYearByMonthByCategoryByItemId/'+year+'/'+month+'/'+category+'/'+itemId, this.BranchId );
    }
    getOrderDetailsUndeliveredByTransNo(transNo) : Observable<any>{
      return this.http.get<any>(_url+'getOrderDetailsUndeliveredByTransNo/'+transNo, this.BranchId );
    }
    updateOrderDetailRecordStatus(id, action) : Observable<any>{
      return this.http.get<any>(_url+'updateOrderDetailRecordStatus/'+id+'/'+action, this.BranchId );
    }
}
