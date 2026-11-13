import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReturnToSupplierDetailsService {

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
 
   getReturnToSupplierDetailsByTransCode(transCode) : Observable<any>{
     return this.http.get<any>(_url+'getReturnToSupplierDetailsByTransCode/'+transCode, this.BranchId );
   }
   getReturnToSupplierDetailById(id) : Observable<any>{
     return this.http.get<any>(_url+'getReturnToSupplierDetailById/'+id, this.BranchId );
   }
   updateReturnToSupplierDetail(data, action) : Observable<any>{
     return this.http.post<any>(_url+'updateReturnToSupplierDetail/'+action,data, this.BranchId );
   }
   computeReturnToSupplierDetailAmount(cost, discountValue, qty, discountType) : Observable<any>{
     return this.http.get<any>(_url+'computeReturnToSupplierDetailAmount/'+cost+'/'+discountValue+'/'+qty+'/'+discountType, this.BranchId );
   }
   getSalesType(transCode) : Observable<any>{
     return this.http.get<any>(_url+'getSalesType/'+transCode, this.BranchId );
   }
   getReturnToSupplierDetailsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
     return this.http.get<any>(_url+'getReturnToSupplierDetailsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
   }
   getReturnToSupplierDetailsByTransNo(transNo) : Observable<any>{
     return this.http.get<any>(_url+'getReturnToSupplierDetailsByTransNo/'+transNo, this.BranchId );
   }
   computeReturnToSupplierRefundable(transCode) : Observable<any>{
     return this.http.get<any>(_url+'computeReturnToSupplierRefundable/'+transCode, this.BranchId );
   }

   getReturnToSupplierDetailsReportByYearByCategory(year,category ) : Observable<any>{
    return this.http.get<any>(_url+'getReturnToSupplierDetailsReportByYearByCategory/'+year+'/'+category, this.BranchId );
  }
  getReturnToSupplierDetailsReportByYearByMonthByCategoryByItemId(year,month,category,itemId ) : Observable<any>{
    return this.http.get<any>(_url+'getReturnToSupplierDetailsReportByYearByMonthByCategoryByItemId/'+year+'/'+month+'/'+category+'/'+itemId, this.BranchId );
  }
  updateReturnToSupplierDetailRecordStatus(id, action) : Observable<any>{
    return this.http.get<any>(_url+'updateReturnToSupplierDetailRecordStatus/'+id+'/'+action, this.BranchId );
  }
}
