import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class POHeadersService {

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

  getPOHeaderByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getPOHeaderByTransCode/'+transCode, this.BranchId );
  }
  getPOHeaderByRecordStatusByInputBy(recordStatus, inputBy) : Observable<any>{
    return this.http.get<any>(_url+'getPOHeaderByRecordStatusByInputBy/'+recordStatus+'/'+inputBy, this.BranchId );
  }
  getPOHeaderByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getPOHeaderByTransNo/'+transNo, this.BranchId );
  }
  getPOHeadersByRecordStatus(recordStatus) : Observable<any>{
    return this.http.get<any>(_url+'getPOHeadersByRecordStatus/'+recordStatus, this.BranchId );
  }
  getPOHeaderComputedAmounts(data) : Observable<any>{
    return this.http.post<any>(_url+'getPOHeaderComputedAmounts',data, this.BranchId );
  }
  updatePOHeader(transCode, totalAmount, action,saleHeaderForm) : Observable<any>{
    return this.http.post<any>(_url+'updatePOHeader/'+transCode+'/'+totalAmount+'/'+action,saleHeaderForm, this.BranchId );
  }
  getPOHeadersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getPOHeadersByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  updatePORecordStatus(transNo, action) : Observable<any>{
    return this.http.get<any>(_url+'updatePORecordStatus/'+transNo+'/'+action, this.BranchId );
  }
  updateVoucherRequest(transNo, voucherNo, action) : Observable<any>{
    return this.http.get<any>(_url+'updateVoucherRequest/'+transNo+'/'+voucherNo+'/'+action, this.BranchId );
  }
  getPOHeadersUndelivered() : Observable<any>{
    return this.http.get<any>(_url+'getPOHeadersUndelivered', this.BranchId );
  }
  getPOUnAddedDownPayment(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getPOUnAddedDownPayment/'+transNo, this.BranchId );
  }
  closePODeliveryHeaderByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'closePODeliveryHeaderByTransNo/'+transNo, this.BranchId );
  }
}
