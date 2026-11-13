import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessStylesService {

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

  getBusinessStyles() : Observable<any>{
    return this.http.get<any>(_url+'getBusinessStyles',this.BranchId);
  }

  getCBOBusinessStyles() : Observable<any>{
    return this.http.get<any>(_url+'getCBOBusinessStyles', this.BranchId);
  }

  saveBusinessStyle(data: any) : Observable<any>{
    return this.http.post<any>(_url+'saveBusinessStyle',data, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
  
  deleteBusinessStyle(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteBusinessStyle/'+id,this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
}
