import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class StocksInquiryService {

  private _refreshrequired=new Subject<void>();
  branch = new HttpHeaders({
    'Content-Type': 'application/json',
    'AuthBranchId': `${this.auth.Branch ? this.auth.Branch.BranchId : null}`,
    'UserId': `${this.auth.LoginId}`,
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

  getCBOItemToStockInquiry() : Observable<any>{
    return this.http.get<any>(_url+'getCBOItemToStockInquiry',this.BranchId);
  }

  getStockInquiryByItemNameByBranchId(ItemName, BranchId) : Observable<any>{
    return this.http.get<any>(_url+'getStockInquiryByItemNameByBranchId/'+ItemName+'/'+BranchId,this.BranchId);
  }
}
