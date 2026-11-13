import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceSheetService {
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
    getBalanceSheetByDateFromByDateTo(dateFrom, dateTo, branchId) : Observable<any>{
      this.BranchId = this.toolBoxService.updateAuthorizationHeader(branchId);
      return this.http.get<any>(_url+'getBalanceSheetByDateFromByDateTo/'+dateFrom+'/'+dateTo,this.BranchId);
    }
}
