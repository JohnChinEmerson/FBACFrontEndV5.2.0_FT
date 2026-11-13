import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class CheckBookletsService {

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
  
    getCheckBookletsByCashAccount(cashAccount,branchId) : Observable<any>{
      this.BranchId = this.toolBoxService.updateAuthorizationHeader(branchId);
      return this.http.get<any>(_url+'getCheckBookletsByCashAccount/'+cashAccount,this.BranchId);
    }
    getCheckBookletsById(id) : Observable<any>{
      return this.http.get<any>(_url+'getCheckBookletsById/'+id,this.BranchId);
    }
    saveEditCheckBooklets(data: any,branchId) : Observable<any>{
      this.BranchId = this.toolBoxService.updateAuthorizationHeader(branchId);
      return this.http.post<any>(_url+'saveEditCheckBooklets',data, this.BranchId).pipe(
        tap(()=>{
          this.requiredRefresh.next();
        })
      );
    }
    deleteCheckBooklet(id, branchId) : Observable<any>{
      this.BranchId = this.toolBoxService.updateAuthorizationHeader(branchId);
      return this.http.get<any>(_url+'deleteCheckBooklet/'+id, this.BranchId).pipe(
            tap(()=>{
              this.requiredRefresh.next();
            })
          );
    }
}
