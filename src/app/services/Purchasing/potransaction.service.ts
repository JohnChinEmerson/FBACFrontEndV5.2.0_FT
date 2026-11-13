import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class POTransactionService {

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

  getPOTransCode( LoginId) : Observable<any>{
    return this.http.get<any>(_url+'getPOTransCode/'+LoginId, this.BranchId );
  }
  
  saveToPOHeaders(ItemId, qty,  transCode, CustomerId, cost, um) : Observable<any>{
    return this.http.get<any>(_url+'saveToPOHeaders/'+ItemId+'/'+qty+'/'+transCode+'/'+CustomerId+'/'+cost+'/'+um, this.BranchId );
  }
  deletePODetailById(Id) : Observable<any>{
    return this.http.get<any>(_url+'deletePODetailById/'+Id, this.BranchId );
  }
  deletePODetailsByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'deletePODetailsByTransCode/'+transCode, this.BranchId );
  }
  updateElementPODetail(Id, Column, Value) : Observable<any>{
    return this.http.get<any>(_url+'updateElementPODetail/'+Id+'/'+Column+'/'+Value, this.BranchId );
  }
  saveAsPendingPOByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'saveAsPendingPOByTransCode/'+transCode, this.BranchId );
  }
  overridePOSupplierByTransCode(transCode, supplierId) : Observable<any>{
    return this.http.get<any>(_url+'overridePOSupplierByTransCode/'+transCode+'/'+supplierId, this.BranchId );
  }
  backToOngoingPOByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'backToOngoingPOByTransCode/'+transCode, this.BranchId );
  }
  deleteAllPOHeadersPending() : Observable<any>{
    return this.http.get<any>(_url+'deleteAllPOHeadersPending', this.BranchId );
  }
  loadCanvass(data) : Observable<any>{
    return this.http.post<any>(_url+'loadCanvass',data, this.BranchId );
  }
}
