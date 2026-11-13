import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryHeadersService {

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

  getDeliveryHeaderByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getDeliveryHeaderByTransCode/'+transCode, this.BranchId );
  }
  getDeliveryHeaderByRecordStatusByInputBy(recordStatus, inputBy) : Observable<any>{
    return this.http.get<any>(_url+'getDeliveryHeaderByRecordStatusByInputBy/'+recordStatus+'/'+inputBy, this.BranchId );
  }
  getDeliveryHeaderByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getDeliveryHeaderByTransNo/'+transNo, this.BranchId );
  }

  getDeliveryHeadersByRecordStatus(recordStatus) : Observable<any>{
    return this.http.get<any>(_url+'getDeliveryHeadersByRecordStatus/'+recordStatus, this.BranchId );
  }
  getDeliveryHeaderComputedAmounts(data) : Observable<any>{
    return this.http.post<any>(_url+'getDeliveryHeaderComputedAmounts',data, this.BranchId );
  }
  updateDeliveryHeader(transCode, totalAmount,btnText,deliveryHeaderForm) : Observable<any>{
    return this.http.post<any>(_url+'updateDeliveryHeader/'+transCode+'/'+totalAmount+'/'+btnText,deliveryHeaderForm, this.BranchId );
  }
  getDeliveryHeadersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getDeliveryHeadersByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  updateDeliveryRecordStatus(transNo, action) : Observable<any>{
    return this.http.get<any>(_url+'updateDeliveryRecordStatus/'+transNo+'/'+action, this.BranchId );
  }
}
