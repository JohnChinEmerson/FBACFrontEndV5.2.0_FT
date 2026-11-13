import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTransactionService {

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

  getExpenseTransCode( LoginId) : Observable<any>{
    return this.http.get<any>(_url+'getExpenseTransCode/'+LoginId, this.BranchId );
  }
  
  saveToExpenseHeaders(ItemId, transCode, CustomerId, price, recordStatus) : Observable<any>{
    return this.http.get<any>(_url+'saveToExpenseHeaders/'+ItemId+'/'+transCode+'/'+CustomerId+'/'+price+'/'+recordStatus, this.BranchId );
  }
  deleteExpenseDetailById(Id) : Observable<any>{
    return this.http.get<any>(_url+'deleteExpenseDetailById/'+Id, this.BranchId );
  }
  deleteExpenseDetailsByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'deleteExpenseDetailsByTransCode/'+transCode, this.BranchId );
  }
  updateElementExpenseDetail(Id, Column, Value) : Observable<any>{
    return this.http.get<any>(_url+'updateElementExpenseDetail/'+Id+'/'+Column+'/'+Value, this.BranchId );
  }
  saveAsPendingExpenseByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'saveAsPendingExpenseByTransCode/'+transCode, this.BranchId );
  }
  overrideExpensePayeeByTransCode(transCode, payeeId) : Observable<any>{
    return this.http.get<any>(_url+'overrideExpensePayeeByTransCode/'+transCode+'/'+payeeId, this.BranchId );
  }
  backToOngoingExpenseByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'backToOngoingExpenseByTransCode/'+transCode, this.BranchId );
  }
  deleteAllExpenseHeadersPending() : Observable<any>{
    return this.http.get<any>(_url+'deleteAllExpenseHeadersPending', this.BranchId );
  }
}
