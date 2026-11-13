import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CanvassDetailSuppliersService {

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

  getCanvassDetailSuppliersByTransCode( transCode) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassDetailSuppliersByTransCode/'+transCode, this.BranchId );
  }

  getCanvassDetailSuppliersByTransDetailId( transDetailId) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassDetailSuppliersByTransDetailId/'+transDetailId, this.BranchId );
  }
  getCanvassDetailSupplierById( id) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassDetailSupplierById/'+id, this.BranchId );
  }
  deleteCanvassDetailSuppliersById( id) : Observable<any>{
    return this.http.get<any>(_url+'deleteCanvassDetailSuppliersById/'+id, this.BranchId );
  }
  updateCanvassDetailSupplierApprovedStatus( id, approvedStatus) : Observable<any>{
    return this.http.get<any>(_url+'updateCanvassDetailSupplierApprovedStatus/'+id+'/'+approvedStatus, this.BranchId );
  }
  getCBOApprovedSuppliersForPO() : Observable<any>{
    return this.http.get<any>(_url+'getCBOApprovedSuppliersForPO', this.BranchId );
  }
  getApprovedSupplierItemsBySupplierIdForPO( supplierId) : Observable<any>{
    return this.http.get<any>(_url+'getApprovedSupplierItemsBySupplierIdForPO/'+supplierId, this.BranchId );
  }
  
}
