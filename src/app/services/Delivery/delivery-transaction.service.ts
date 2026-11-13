import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryTransactionService {

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

  getDeliveryTransCode(LoginId) : Observable<any>{
    return this.http.get<any>(_url+'getDeliveryTransCode/'+LoginId, this.BranchId );
  }
  
  saveToDeliveryHeaders(receiptNo,transCode) : Observable<any>{
    return this.http.get<any>(_url+'saveToDeliveryHeaders/'+receiptNo+'/'+transCode, this.BranchId );
  }
  deleteDeliveryDetailById(Id) : Observable<any>{
    return this.http.get<any>(_url+'deleteDeliveryDetailById/'+Id, this.BranchId );
  }
  deleteDeliveryDetailsByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'deleteDeliveryDetailsByTransCode/'+transCode, this.BranchId );
  }
  updateElementDeliveryDetail(Id, Column, Value) : Observable<any>{
    return this.http.get<any>(_url+'updateElementDeliveryDetail/'+Id+'/'+Column+'/'+Value, this.BranchId );
  }
}
