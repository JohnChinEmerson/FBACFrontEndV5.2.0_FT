import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryDetailsService {

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

  getDeliveryDetailsByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getDeliveryDetailsByTransCode/'+transCode, this.BranchId );
  }
  getDeliveryDetailById(id) : Observable<any>{
    return this.http.get<any>(_url+'getDeliveryDetailById/'+id, this.BranchId );
  }
  updateDeliveryDetail(data, action) : Observable<any>{
    return this.http.post<any>(_url+'updateDeliveryDetail/'+action,data, this.BranchId );
  }
  computeDeliveryDetailAmount(price, discountValue, qty, discountType, vATType) : Observable<any>{
    return this.http.get<any>(_url+'computeDeliveryDetailAmount/'+price+'/'+discountValue+'/'+qty+'/'+discountType+'/'+vATType, this.BranchId );
  }
  getDeliveryType(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getDeliveryType/'+transCode, this.BranchId );
  }
  getDeliveryDetailsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getDeliveryDetailsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  getDeliveryDetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getDeliveryDetailsByTransNo/'+transNo, this.BranchId );
  }
  getDeliveryDetailsReportByYearByCategory(year,category ) : Observable<any>{
    return this.http.get<any>(_url+'getDeliveryDetailsReportByYearByCategory/'+year+'/'+category, this.BranchId );
  }
  getDeliveryDetailsReportByYearByMonthByCategoryByItemId(year,month,category,itemId ) : Observable<any>{
    return this.http.get<any>(_url+'getDeliveryDetailsReportByYearByMonthByCategoryByItemId/'+year+'/'+month+'/'+category+'/'+itemId, this.BranchId );
  }
  updateDeliveryDetailRecordStatus(id, action) : Observable<any>{
    return this.http.get<any>(_url+'updateDeliveryDetailRecordStatus/'+id+'/'+action, this.BranchId );
  }
}
