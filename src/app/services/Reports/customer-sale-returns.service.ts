import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerSaleReturnsService {

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
    private toolBoxService : ToolBoxService,
  ) { 
    this.BranchId ={ headers: this.branch};
  }

  get RequiredRefresh(){
    return this._refreshrequired;
  }

  getCustomerSaleReturnsByDateFromByDateToByWithDateByCustomerId(dateFrom, dateTo, withDate,customerName, branchId) : Observable<any>{
    this.BranchId = this.toolBoxService.updateAuthorizationHeader(branchId);
    return this.http.get<any>(_url+'getCustomerSaleReturnsByDateFromByDateToByWithDateByCustomerId/'+dateFrom+'/'+dateTo+'/'+withDate+'/'+customerName, this.BranchId );
  }
  getCustomerSaleReturnDetailsByDateFromByDateToByWithDateByCustomerId(dateFrom, dateTo, withDate, customerName, branchId) : Observable<any>{
    this.BranchId = this.toolBoxService.updateAuthorizationHeader(branchId);
  return this.http.get<any>(_url+'getCustomerSaleReturnDetailsByDateFromByDateToByWithDateByCustomerId/'+dateFrom+'/'+dateTo+'/'+withDate+'/'+customerName, this.BranchId );
}
}
