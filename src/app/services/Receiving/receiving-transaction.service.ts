import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReceivingTransactionService {

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

  getReceivingTransCode( LoginId) : Observable<any>{
    return this.http.get<any>(_url+'getReceivingTransCode/'+LoginId, this.BranchId );
  }
  
  saveToReceivingHeaders(ItemId, qty,  transCode, CustomerId, cost, um, recordStatus) : Observable<any>{
    return this.http.get<any>(_url+'saveToReceivingHeaders/'+ItemId+'/'+qty+'/'+transCode+'/'+CustomerId+'/'+cost+'/'+um+'/'+recordStatus, this.BranchId );
  }
  deleteReceivingDetailById(Id) : Observable<any>{
    return this.http.get<any>(_url+'deleteReceivingDetailById/'+Id, this.BranchId );
  }
  deleteReceivingDetailsByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'deleteReceivingDetailsByTransCode/'+transCode, this.BranchId );
  }
  updateElementReceivingDetail(Id, Column, Value) : Observable<any>{
    return this.http.get<any>(_url+'updateElementReceivingDetail/'+Id+'/'+Column+'/'+Value, this.BranchId );
  }
  saveAsPendingReceivingByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'saveAsPendingReceivingByTransCode/'+transCode, this.BranchId );
  }
  overrideReceivingSupplierByTransCode(transCode, supplierId) : Observable<any>{
    return this.http.get<any>(_url+'overrideReceivingSupplierByTransCode/'+transCode+'/'+supplierId, this.BranchId );
  }
  backToOngoingReceivingByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'backToOngoingReceivingByTransCode/'+transCode, this.BranchId );
  }
  deleteAllReceivingHeadersPending() : Observable<any>{
    return this.http.get<any>(_url+'deleteAllReceivingHeadersPending', this.BranchId );
  }
  loadPO(data) : Observable<any>{
    return this.http.post<any>(_url+'loadPO',data, this.BranchId );
  }
}
