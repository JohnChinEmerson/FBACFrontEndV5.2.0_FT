import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class CashAccountsService {

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
    private toolBoxService : ToolBoxService,
  ) { 
    this.BranchId ={ headers: this.branch};
  }


  get requiredRefresh(){
    return this._refreshrequired;
  }

  setPaymentTypes(customerId, withCharge:boolean) : Observable<any>{
    return this.http.get<any>(_url+'setPaymentTypes/'+customerId+'/'+withCharge,this.BranchId);
  }
  getCashAccountsByBuiltIn(builtIn) : Observable<any>{
    return this.http.get<any>(_url+'getCashAccountsByBuiltIn/'+builtIn,this.BranchId);
  }
  getCashAccountsByBuiltIn2(builtIn, branchId) : Observable<any>{
    this.BranchId = this.toolBoxService.updateAuthorizationHeader(branchId);
    return this.http.get<any>(_url+'getCashAccountsByBuiltIn/'+builtIn,this.BranchId);
  }
  getDestinationBySourceAccount(source) : Observable<any>{
    return this.http.get<any>(_url+'getDestinationBySourceAccount/'+source,this.BranchId);
  }
  getCashAccountsById(id) : Observable<any>{
    return this.http.get<any>(_url+'getCashAccountsById/'+id,this.BranchId);
  }
  loadCashAccounts(paymentType) : Observable<any>{
    return this.http.get<any>(_url+'loadCashAccounts/'+paymentType,this.BranchId);
  }
  loadCashAccounts2(paymentType, branchId) : Observable<any>{
    this.BranchId = this.toolBoxService.updateAuthorizationHeader(branchId);
    return this.http.get<any>(_url+'loadCashAccounts/'+paymentType,this.BranchId);
  }
  saveEditCashAccounts(data: any, branchId) : Observable<any>{
    this.BranchId = this.toolBoxService.updateAuthorizationHeader(branchId);
    return this.http.post<any>(_url+'saveEditCashAccounts',data, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  deleteCashAccount(id, branchId) : Observable<any>{
    this.BranchId = this.toolBoxService.updateAuthorizationHeader(branchId);
    return this.http.get<any>(_url+'deleteCashAccount/'+id, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

}
