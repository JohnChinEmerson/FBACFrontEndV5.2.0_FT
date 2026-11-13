import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class ExpiryDatesService {

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
      private toolbox: ToolBoxService,
    ) { 
      this.BranchId ={ headers: this.branch};
    }
  
    get requiredRefresh(){
      return this._refreshrequired;
    }
  
    getExpiryDatesByItemIdByFilter(itemId, filter) : Observable<any>{
      return this.http.get<any>(_url+'getExpiryDatesByItemIdByFilter/'+itemId+'/'+filter, this.BranchId);
    }

    saveExpiry2(data, btnText) : Observable<any>{
      return this.http.post<any>(_url+'saveExpiry2/'+btnText,data,this.BranchId);
    }
 
    deleteExpiryDate(id) : Observable<any>{
      return this.http.get<any>(_url+'deleteExpiryDate/'+id, this.BranchId).pipe(
        tap(()=>{
          this.requiredRefresh.next();
        })
      );
    }
}
