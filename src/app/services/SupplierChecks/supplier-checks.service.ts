import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
@Injectable({
  providedIn: 'root'
})
export class SupplierChecksService {

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

  getUnPaidSupplierChecks(supplierId) : Observable<any>{
    return this.http.get<any>(_url+'getUnPaidSupplierChecks/'+supplierId,this.BranchId);
  }

  getSupplierChecksByStatusByYearByMonth(status, year, month) : Observable<any>{
    return this.http.get<any>(_url+'getSupplierChecksByStatusByYearByMonth/'+status+'/'+year+'/'+month,this.BranchId);
  }

  depositSupplierChecks(depositStatus, data) : Observable<any>{
    return this.http.post<any>(_url+'depositSupplierChecks/'+depositStatus,data, this.BranchId );
  }

  
}
