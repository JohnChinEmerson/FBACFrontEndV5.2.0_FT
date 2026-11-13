import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class IndexTablesService {

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

  
  getIndexTables() : Observable<any>{
    return this.http.get<any>(_url+'getIndexTables',this.BranchId);
  }

  getTransNames() : Observable<any>{
    return this.http.get<any>(_url+'getTransNames',this.BranchId);
  }

  getIndexTablesHasPaymentType(hasPaymentType) : Observable<any>{
    return this.http.get<any>(_url+'getIndexTablesHasPaymentType/'+hasPaymentType,this.BranchId);
  }

  loadCashflowAccountTitles() : Observable<any>{
    return this.http.get<any>(_url+'loadCashflowAccountTitles',this.BranchId);
  }
}
