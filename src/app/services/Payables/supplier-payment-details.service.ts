import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierPaymentDetailsService {

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

  getSupplierPaymentDetailsByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getSupplierPaymentDetailsByTransCode/'+transCode, this.BranchId );
  }
  getPendingTransNosByCustomerId(customerId) : Observable<any>{
    return this.http.get<any>(_url+'getPendingTransNosByCustomerId/'+customerId, this.BranchId );
  }
  
  getSupplierPaymentDetailById(id) : Observable<any>{
    return this.http.get<any>(_url+'getSupplierPaymentDetailById/'+id, this.BranchId );
  }
  updateSupplierPaymentDetail(data, action) : Observable<any>{
    return this.http.post<any>(_url+'updateSupplierPaymentDetail/'+action,data, this.BranchId );
  }
  computeSupplierPaymentDetailAmount(price, discountValue, qty, discountType, vATType) : Observable<any>{
    return this.http.get<any>(_url+'computeSupplierPaymentDetailAmount/'+price+'/'+discountValue+'/'+qty+'/'+discountType+'/'+vATType, this.BranchId );
  }
  getSalesType(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getSalesType/'+transCode, this.BranchId );
  }
  getSupplierPaymentDetailsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getSupplierPaymentDetailsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  getSupplierPaymentDetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getSupplierPaymentDetailsByTransNo/'+transNo, this.BranchId );
  }
  getOpenSupplierPaymentDetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getOpenSupplierPaymentDetailsByTransNo/'+transNo, this.BranchId );
  }
  updateSupplierPaymentDetailRecordStatus(id, action) : Observable<any>{
    return this.http.get<any>(_url+'updateSupplierPaymentDetailRecordStatus/'+id+'/'+action, this.BranchId );
  }
}
