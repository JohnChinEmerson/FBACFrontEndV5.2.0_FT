import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

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

  get requiredRefresh(){
    return this._refreshrequired;
  }
  
  getCBOSuppliers() : Observable<any>{
    return this.http.get<any>(_url+'getCBOSuppliers',this.BranchId );
  }
  getCBOSuppliers2(branchId) : Observable<any>{
    this.BranchId = this.toolBoxService.updateAuthorizationHeader(branchId);
    return this.http.get<any>(_url+'getCBOSuppliers2',this.BranchId );
  }
  getSuppliersToDisplay() : Observable<any>{
    return this.http.get<any>(_url+'getSuppliersToDisplay',this.BranchId );
  }

  getSupplierBySupplierId(SupplierId) : Observable<any>{
    return this.http.get<any>(_url+'getSupplierBySupplierId/'+SupplierId,this.BranchId );
  }

  saveEditSuppliers(data: any,btnText) : Observable<any>{
    return this.http.post<any>(_url+'saveEditSuppliers/'+btnText,data,this.BranchId ).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  deleteSupplier(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteSupplier/'+id,this.BranchId ).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  getSupplierItemsBySupplierId(SupplierId) : Observable<any>{
    return this.http.get<any>(_url+'getSupplierItemsBySupplierId/'+SupplierId,this.BranchId );
  }
  
  importSuppliers(data):Observable<any>
  {
    return this.http.post<any>(_url+"importSuppliers",data, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
}
