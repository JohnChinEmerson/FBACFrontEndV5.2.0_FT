import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class UserActivitiesService {

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

  getUserActivitiesByTransDateByTransDateTo(TransDateFrom, TransDateTo,BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getUserActivitiesByTransDateByTransDateTo/'+TransDateFrom+'/'+TransDateTo, this.BranchId);
  }

  // everything done in the period: the activity log plus the transactions / files created, voided or deleted
  // -> { rows: newest first (at most 'limit'), total: how many there were, limit }
  getActivityFeed(TransDateFrom, TransDateTo, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getActivityFeed/'+TransDateFrom+'/'+TransDateTo, this.BranchId);
  }

  // one record as it is now + every event about it (RecordId: the id of the row, for kinds whose RefNo is shared)
  getActivityTrail(TransType, RefNo, BranchId, RecordId?) : Observable<any>{
    const options = this.toolbox.updateAuthorizationHeader(BranchId);
    const params: any = { TransType: TransType, RefNo: RefNo };
    if(RecordId !== null && RecordId !== undefined)
      params.RecordId = RecordId;
    return this.http.get<any>(_url+'getActivityTrail', { headers: options.headers, params: params });
  }

  // activities only the screens know about (Action: PRINT / EXPORT)
  logActivity(Action: string, UserInterface: string, Subject: string) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(this.auth.Branch ? this.auth.Branch.BranchId : null);
    return this.http.post<any>(_url+'logActivity', { Action, UserInterface, Subject }, this.BranchId);
  }
}
