import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessInfoService {

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

  getBusinessInfo() : Observable<any>{
    return this.http.get<any>(_url+'getBusinessInfo', this.BranchId );
  }

  SaveEditBusinessInfo(data: any) : Observable<any>{
    return this.http.post<any>(_url+'SaveEditBusinessInfo',data, this.BranchId ).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  addBackgroundLogo(data: any) : Observable<any>{
    return this.http.post<any>(_url+'addBackgroundLogo',data);
  }
  resetToDefault(column) : Observable<any>{
    return this.http.get<any>(_url+'resetToDefault/'+column, this.BranchId);
  }
}
