import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class DiscountApplicationsService {

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

  getDiscountApplications(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getDiscountApplications/'+transNo, this.BranchId );
  }
  saveDiscountApplication(transNo, data) : Observable<any>{
    return this.http.post<any>(_url+'saveDiscountApplication/'+transNo, data, this.BranchId ).pipe(tap(() => this.RequiredRefresh.next()));
  }
  deleteDiscountApplication(transNo, id) : Observable<any>{
    return this.http.get<any>(_url+'deleteDiscountApplication/'+transNo+'/'+id, this.BranchId ).pipe(tap(() => this.RequiredRefresh.next()));
  }
}
