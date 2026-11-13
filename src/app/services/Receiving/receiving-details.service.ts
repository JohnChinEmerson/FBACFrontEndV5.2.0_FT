import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReceivingDetailsService {
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

  getReceivingDetailsByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getReceivingDetailsByTransCode/'+transCode, this.BranchId );
  }
  getReceivingDetailById(id) : Observable<any>{
    return this.http.get<any>(_url+'getReceivingDetailById/'+id, this.BranchId );
  }
  updateReceivingDetail(data, action) : Observable<any>{
    return this.http.post<any>(_url+'updateReceivingDetail/'+action,data, this.BranchId );
  }
  computeReceivingDetailAmount(price, discountValue, qty, discountType,vatType) : Observable<any>{
    return this.http.get<any>(_url+'computeReceivingDetailAmount/'+price+'/'+discountValue+'/'+qty+'/'+discountType+'/'+vatType, this.BranchId );
  }
  getReceivingDetailsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getReceivingDetailsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  getReceivingDetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getReceivingDetailsByTransNo/'+transNo, this.BranchId );
  }
  getReceivingDetailsByItemIdByAveCostMethod(itemId, aveCostMethod) : Observable<any>{
    return this.http.get<any>(_url+'getReceivingDetailsByItemIdByAveCostMethod/'+itemId+'/'+aveCostMethod, this.BranchId );
  }
  getOpenReceivingDetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getOpenReceivingDetailsByTransNo/'+transNo, this.BranchId );
  }
  getReceivingDetailsForReturnToSupplierByDateFromByDateToBySupplierIdWDate(dateFrom, dateTo, customerId, withDate) : Observable<any>{
    return this.http.get<any>(_url+'getReceivingDetailsForReturnToSupplierByDateFromByDateToBySupplierIdWDate/'+dateFrom+'/'+dateTo+'/'+customerId+'/'+withDate, this.BranchId );
  }
  updateReceivingDetailRecordStatus(id, action) : Observable<any>{
    return this.http.get<any>(_url+'updateReceivingDetailRecordStatus/'+id+'/'+action, this.BranchId );
  }
  getReceivingSalesType(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getReceivingSalesType/'+transCode, this.BranchId );
  }
}
