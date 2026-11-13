import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class BranchAccessService {
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

  getBranchAccessToDisplayByBranchId(BranchId) : Observable<any>{
    return this.http.get<any>(_url+'getBranchAccessToDisplayByBranchId/'+BranchId, this.BranchId);
  }

  GetBranchAccessById(Id) : Observable<any>{
    return this.http.get<any>(_url+'GetBranchAccessById/'+Id, this.BranchId);
  }

  saveBranchAccess(data, branchId) : Observable<any>{
    return this.http.post<any>(_url+'saveBranchAccess/'+branchId,data, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  deleteBranchAccess(data) : Observable<any>{
    return this.http.post<any>(_url+'deleteBranchAccess',data, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
}
