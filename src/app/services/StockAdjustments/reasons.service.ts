import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class ReasonsService {

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
    private toolbox : ToolBoxService,
  ) { 
    this.BranchId ={ headers: this.branch};
  }

  get requiredRefresh(){
    return this._refreshrequired;
  }
  
  getCBOReasons() : Observable<any>{
    return this.http.get<any>(_url+'getCBOReasons',this.BranchId );
  }
  getCBOReasonsByAdjustmentType(adjustmentType) : Observable<any>{
    return this.http.get<any>(_url+'getCBOReasonsByAdjustmentType/'+adjustmentType,this.BranchId );
  }
  getReasonsToDisplay() : Observable<any>{
    return this.http.get<any>(_url+'getReasonsToDisplay',this.BranchId );
  }

  getReasonByReasonId(ReasonId) : Observable<any>{
    return this.http.get<any>(_url+'getReasonByReasonId/'+ReasonId,this.BranchId );
  }

  saveReason(data: any) : Observable<any>{
    return this.http.post<any>(_url+'saveReason',data,this.BranchId ).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  deleteReason(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteReason/'+id,this.BranchId ).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
}
