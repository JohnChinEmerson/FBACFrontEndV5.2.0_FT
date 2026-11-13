import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PayableStatementsService {

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

  loadSupplierWithAllWithBalance(withAll, withBalance) : Observable<any>{
    return this.http.get<any>(_url+'loadSupplierWithAllWithBalance/'+withAll+'/'+withBalance, this.BranchId );
  }
  getReceiptsBySupplierId(customerId) : Observable<any>{
    return this.http.get<any>(_url+'getReceiptsBySupplierId/'+customerId, this.BranchId );
  }
  getPayableReceiptBySourceTransNo(sourceTransNo) : Observable<any>{
    return this.http.get<any>(_url+'getPayableReceiptBySourceTransNo/'+sourceTransNo, this.BranchId );
  }
  updatePayableBadDebt(sourceTransNo, tableName, value) : Observable<any>{
    return this.http.get<any>(_url+'updatePayableBadDebt/'+sourceTransNo+'/'+tableName+'/'+value, this.BranchId );
  }
  
}
