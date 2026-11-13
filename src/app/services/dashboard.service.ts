import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from './auth.service';
import { ToolBoxService } from './tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

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

  get RequiredRefresh(){
    return this._refreshrequired;
  }

  // F&B dashboard: today vs yesterday, trend, top items, categories, payments, open orders, low stock, discounts
  getFnbDashboard(days, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getFnbDashboard/'+days,this.BranchId);
  }

  // F&B dashboard between two dates (yyyy-mm-dd): the range vs the same number of days before it
  getFnbDashboardByDateRange(dateFrom, dateTo, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getFnbDashboardByDateRange/'+dateFrom+'/'+dateTo,this.BranchId);
  }

  getDashboardYearlyTotals(Year, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getDashboardYearlyTotals/'+Year,this.BranchId);
  }

  getDashboardTotalsByYear(Year,  BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getDashboardTotalsByYear/'+Year,this.BranchId);
  }
  getDashboardProfitTotalsByYear(Year,  BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getDashboardProfitTotalsByYear/'+Year,this.BranchId);
  }
  getDashboardTopSellingProductsByYear(Year,  BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getDashboardTopSellingProductsByYear/'+Year,this.BranchId);
  }
  

}
