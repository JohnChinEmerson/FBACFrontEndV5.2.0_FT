import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PODetailsService {
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

  getPODetailsByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getPODetailsByTransCode/'+transCode, this.BranchId );
  }
  getPODetailById(id) : Observable<any>{
    return this.http.get<any>(_url+'getPODetailById/'+id, this.BranchId );
  }
  updatePODetail(data, action) : Observable<any>{
    return this.http.post<any>(_url+'updatePODetail/'+action,data, this.BranchId );
  }
  computePODetailAmount(price, discountValue, qty, discountType) : Observable<any>{
    return this.http.get<any>(_url+'computePODetailAmount/'+price+'/'+discountValue+'/'+qty+'/'+discountType, this.BranchId );
  }
  getPODetailsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getPODetailsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  getPODetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getPODetailsByTransNo/'+transNo, this.BranchId );
  }
  getOpenPODetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getOpenPODetailsByTransNo/'+transNo, this.BranchId );
  }
  getPODetailsForReturnToSupplierByDateFromByDateToBySupplierIdWDate(dateFrom, dateTo, customerId, withDate) : Observable<any>{
    return this.http.get<any>(_url+'getPODetailsForReturnToSupplierByDateFromByDateToBySupplierIdWDate/'+dateFrom+'/'+dateTo+'/'+customerId+'/'+withDate, this.BranchId );
  }
  getPODetailsReportByYearByCategory(year,category ) : Observable<any>{
    return this.http.get<any>(_url+'getPODetailsReportByYearByCategory/'+year+'/'+category, this.BranchId );
  }
  updatePODetailRecordStatus(id, action) : Observable<any>{
    return this.http.get<any>(_url+'updatePODetailRecordStatus/'+id+'/'+action, this.BranchId );
  }
  getPODetailsUndeliveredByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getPODetailsUndeliveredByTransNo/'+transNo, this.BranchId );
  }
  closePODeliveryDetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'closePODeliveryDetailsByTransNo/'+transNo, this.BranchId );
  }

  getPOSalesType(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getPOSalesType/'+transCode, this.BranchId );
  }
}
