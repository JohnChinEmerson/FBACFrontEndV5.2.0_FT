import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

// Sales > Kitchen Queue: item-level kitchen status of the lines sent with SEND.
@Injectable({
  providedIn: 'root'
})
export class KitchenQueueService {

  private _requiredRefresh = new Subject<void>();
  get requiredRefresh(){
    return this._requiredRefresh;
  }

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

  // view: active | ready | history
  getKitchenQueue(view, dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getKitchenQueue/'+view+'/'+dateFrom+'/'+dateTo,this.BranchId);
  }
  updateKitchenStatus(ids: any[], status) : Observable<any>{
    return this.http.post<any>(_url+'updateKitchenStatus',{ 'Ids': ids, 'Status': status }, this.BranchId)
      .pipe(tap(() => this.requiredRefresh.next()));
  }
  getKitchenReadyNotices() : Observable<any>{
    return this.http.get<any>(_url+'getKitchenReadyNotices',this.BranchId);
  }
  acknowledgeCancelled(ids: any[]) : Observable<any>{
    return this.http.post<any>(_url+'acknowledgeCancelled',{ 'Ids': ids }, this.BranchId)
      .pipe(tap(() => this.requiredRefresh.next()));
  }
  // Sales Transaction poll: ReadyLines, Notices and the kitchen status of the order's lines (transNo or 'none')
  getSalesKitchenUpdates(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getSalesKitchenUpdates/'+(transNo || 'none'),this.BranchId);
  }
}
