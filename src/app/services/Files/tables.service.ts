import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

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

  getTablesByTableCategory(tableCategory) : Observable<any>{
    return this.http.get<any>(_url+'getTablesByTableCategory/'+encodeURIComponent(tableCategory),this.BranchId);
  }

  generateTables(data: any) : Observable<any>{
    return this.http.post<any>(_url+'generateTables',data, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  deleteTable(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteTable/'+id,this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  deleteTables(ids: any[]) : Observable<any>{
    return this.http.post<any>(_url+'deleteTables',{ 'ids': ids }, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  getTableCategorys() : Observable<any>{
    return this.http.get<any>(_url+'getTableCategorys',this.BranchId);
  }

  saveTableCategory(data: any) : Observable<any>{
    return this.http.post<any>(_url+'saveTableCategory',data, this.BranchId);
  }

  deleteTableCategory(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteTableCategory/'+id,this.BranchId);
  }
}
