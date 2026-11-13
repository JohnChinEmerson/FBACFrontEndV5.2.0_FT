import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CanvassTransactionService {
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

  getCanvassTransCode( LoginId) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassTransCode/'+LoginId, this.BranchId );
  }
  
  saveToCanvassHeaders(ItemId, qty,  transCode, ReasonId, um) : Observable<any>{
    return this.http.get<any>(_url+'saveToCanvassHeaders/'+ItemId+'/'+qty+'/'+transCode+'/'+ReasonId+'/'+um, this.BranchId );
  }
  deleteCanvassDetailById(Id) : Observable<any>{
    return this.http.get<any>(_url+'deleteCanvassDetailById/'+Id, this.BranchId );
  }
  deleteCanvassDetailsByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'deleteCanvassDetailsByTransCode/'+transCode, this.BranchId );
  }
  updateElementCanvassDetail(Id, Column, Value) : Observable<any>{
    return this.http.get<any>(_url+'updateElementCanvassDetail/'+Id+'/'+Column+'/'+Value, this.BranchId );
  }
  saveAsPendingCanvassByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'saveAsPendingCanvassByTransCode/'+transCode, this.BranchId );
  }
  overrideCanvassReasonByTransCode(transCode, reasonId) : Observable<any>{
    return this.http.get<any>(_url+'overrideCanvassReasonByTransCode/'+transCode+'/'+reasonId, this.BranchId );
  }
  backToOngoingCanvassByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'backToOngoingCanvassByTransCode/'+transCode, this.BranchId );
  }
  deleteAllCanvassHeadersPending() : Observable<any>{
    return this.http.get<any>(_url+'deleteAllCanvassHeadersPending', this.BranchId );
  }
  addSupplierFromCanvassTransaction(data) : Observable<any>{
    return this.http.post<any>(_url+'addSupplierFromCanvassTransaction',data, this.BranchId );
  }
}
