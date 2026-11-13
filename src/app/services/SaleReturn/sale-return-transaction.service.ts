import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SaleReturnTransactionService {

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

  getSaleReturnTransCode(LoginId) : Observable<any>{
    return this.http.get<any>(_url+'getSaleReturnTransCode/'+LoginId, this.BranchId );
  }
  
  saveToSaleReturnHeaders(saleDetailId, transCode, CustomerId, price, recordStatus) : Observable<any>{
    return this.http.get<any>(_url+'saveToSaleReturnHeaders/'+saleDetailId+'/'+transCode+'/'+CustomerId+'/'+price+'/'+recordStatus, this.BranchId );
  }
  deleteSaleReturnDetailById(Id) : Observable<any>{
    return this.http.get<any>(_url+'deleteSaleReturnDetailById/'+Id, this.BranchId );
  }
  deleteSaleReturnDetailsByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'deleteSaleReturnDetailsByTransCode/'+transCode, this.BranchId );
  }
  updateElementSaleReturnDetail(Id, Column, Value) : Observable<any>{
    return this.http.get<any>(_url+'updateElementSaleReturnDetail/'+Id+'/'+Column+'/'+Value, this.BranchId );
  }

  saveAsPendingSaleReturnByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'saveAsPendingSaleReturnByTransCode/'+transCode, this.BranchId );
  }
  backToOngoingSaleReturnByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'backToOngoingSaleReturnByTransCode/'+transCode, this.BranchId );
  }
  deleteAllSaleReturnHeadersPending() : Observable<any>{
    return this.http.get<any>(_url+'deleteAllSaleReturnHeadersPending', this.BranchId );
  }

}
