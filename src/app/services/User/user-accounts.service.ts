import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class UserAccountsService {

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
    private http    : HttpClient,
    private auth    : AuthService,
    private toolbox : ToolBoxService,
  ) { 
    this.BranchId ={ headers: this.branch};
  }

  get requiredRefresh(){
    return this._refreshrequired;
  }

  getUserAccountsToDisplay(BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getUserAccountsToDisplay', this.BranchId );
  }

  getUserAccountsByBranchId(BranchId) : Observable<any>{
    return this.http.get<any>(_url+'getUserAccountsByBranchId/'+BranchId, this.BranchId );
  }
  getUserAccountById(Id) : Observable<any>{
    return this.http.get<any>(_url+'getUserAccountById/'+Id, this.BranchId );
  }

  getCBOUserAccounts() : Observable<any>{
    return this.http.get<any>(_url+'getCBOUserAccounts', this.BranchId );
  }
  getCBOUserAccountsByBranchId(branchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(branchId);
    return this.http.get<any>(_url+'getCBOUserAccounts', this.BranchId );
  }
  saveEditUserAccount(data: any, BranchId) : Observable<any>{
    if(BranchId == 'NA')
      BranchId = "";
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.post<any>(_url+'saveEditUserAccount',data, this.BranchId ).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
  updateProfile(data: any) : Observable<any>{
    return this.http.post<any>(_url+'updateProfile',data, this.BranchId ).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
  changePassword(data: any, BranchId) : Observable<any>{
    if(BranchId == 'NA')
      BranchId = "";
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.post<any>(_url+'changePassword',data, this.BranchId ).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
  deleteUserAccountById(Id, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'deleteUserAccountById/'+Id, this.BranchId ).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  resetPasswordById(Id, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'resetPasswordById/'+Id, this.BranchId ).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
}
