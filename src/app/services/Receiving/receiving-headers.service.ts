import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReceivingHeadersService {

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

  getReceivingHeaderByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getReceivingHeaderByTransCode/'+transCode, this.BranchId );
  }
  getReceivingHeaderByRecordStatusByInputBy(recordStatus, inputBy) : Observable<any>{
    return this.http.get<any>(_url+'getReceivingHeaderByRecordStatusByInputBy/'+recordStatus+'/'+inputBy, this.BranchId );
  }
  getReceivingHeaderByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getReceivingHeaderByTransNo/'+transNo, this.BranchId );
  }
  getReceivingHeadersByRecordStatus(recordStatus) : Observable<any>{
    return this.http.get<any>(_url+'getReceivingHeadersByRecordStatus/'+recordStatus, this.BranchId );
  }
  getReceivingHeaderComputedAmounts(data) : Observable<any>{
    return this.http.post<any>(_url+'getReceivingHeaderComputedAmounts',data, this.BranchId );
  }
  updateReceivingHeader(transCode, totalAmount, oHeader, recordStatus, action,saleHeaderForm) : Observable<any>{
    return this.http.post<any>(_url+'updateReceivingHeader/'+transCode+'/'+totalAmount+'/'+oHeader+'/'+recordStatus+'/'+action,saleHeaderForm, this.BranchId );
  }
  getReceivingHeadersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getReceivingHeadersByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  updateReceivingRecordStatus(transNo, action) : Observable<any>{
    return this.http.get<any>(_url+'updateReceivingRecordStatus/'+transNo+'/'+action, this.BranchId );
  }
}
