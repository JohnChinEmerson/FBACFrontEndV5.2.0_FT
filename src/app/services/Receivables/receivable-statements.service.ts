import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReceivableStatementsService {

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
  
    loadCustomerWithAllWithBalance(withAll, withBalance) : Observable<any>{
      return this.http.get<any>(_url+'loadCustomerWithAllWithBalance/'+withAll+'/'+withBalance, this.BranchId );
    }
    getReceiptsByCustomerId(customerId) : Observable<any>{
      return this.http.get<any>(_url+'getReceiptsByCustomerId/'+customerId, this.BranchId );
    }
    getReceiptBySourceTransNo(sourceTransNo) : Observable<any>{
      return this.http.get<any>(_url+'getReceiptBySourceTransNo/'+sourceTransNo, this.BranchId );
    }
    updateBadDebt(sourceTransNo, tableName, value) : Observable<any>{
      return this.http.get<any>(_url+'updateBadDebt/'+sourceTransNo+'/'+tableName+'/'+value, this.BranchId );
    }
    
}
