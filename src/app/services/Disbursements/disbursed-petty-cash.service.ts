import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class DisbursedPettyCashService {

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

  get requiredRefresh(){
    return this._refreshrequired;
  }

  loadUnliquidatedWithBalance() : Observable<any>{
    return this.http.get<any>(_url+'loadUnliquidatedWithBalance',this.BranchId);
  }

  getPettyCashUnliquidated() : Observable<any>{
    return this.http.get<any>(_url+'getPettyCashUnliquidated',this.BranchId);
  }
  getPettyCashLiquidatedByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getPettyCashLiquidatedByDateFromByDateTo/'+dateFrom+'/'+dateTo,this.BranchId);
  }
  getPaidTransactionsByDisburseNo(disburseNo) : Observable<any>{
    return this.http.get<any>(_url+'getPaidTransactionsByDisburseNo/'+disburseNo,this.BranchId);
  }
  
  saveOffsetFromPettyCash(data,btntText) : Observable<any>{
    return this.http.post<any>(_url+'saveOffsetFromPettyCash/'+btntText,data,this.BranchId);
  }

  liquidatePettyCash(disburseNo,amountCount) : Observable<any>{
    return this.http.get<any>(_url+'liquidatePettyCash/'+disburseNo+'/'+amountCount,this.BranchId);
  }
  deletePaidTransaction(data: any): Observable<any> {
  return this.http.post<any>(_url + 'deletePaidTransaction',data,this.BranchId);
}
}
