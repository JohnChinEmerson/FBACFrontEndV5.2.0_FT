import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CashierAccessRightsService {

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

  getCashierAccessRights() : Observable<any>{
    return this.http.get<any>(_url+'getCashierAccessRights', this.BranchId );
  }
  saveCashierAccessRights(data) : Observable<any>{
    return this.http.post<any>(_url+'saveCashierAccessRights',data, this.BranchId );
  }
  deleteCashierAccessRights(data) : Observable<any>{
    return this.http.post<any>(_url+'deleteCashierAccessRights',data, this.BranchId );
  }
  
}
