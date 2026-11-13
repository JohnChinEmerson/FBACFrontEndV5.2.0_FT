import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReturnToSupplierTransactionService {

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
 
   getReturnToSupplierTransCode(LoginId) : Observable<any>{
     return this.http.get<any>(_url+'getReturnToSupplierTransCode/'+LoginId, this.BranchId );
   }
   
   saveToReturnToSupplierHeaders(receivingDetailId, transCode, CustomerId, price, recordStatus) : Observable<any>{
     return this.http.get<any>(_url+'saveToReturnToSupplierHeaders/'+receivingDetailId+'/'+transCode+'/'+CustomerId+'/'+price+'/'+recordStatus, this.BranchId );
   }
   deleteReturnToSupplierDetailById(Id) : Observable<any>{
     return this.http.get<any>(_url+'deleteReturnToSupplierDetailById/'+Id, this.BranchId );
   }
   deleteReturnToSupplierDetailsByTransCode(transCode) : Observable<any>{
     return this.http.get<any>(_url+'deleteReturnToSupplierDetailsByTransCode/'+transCode, this.BranchId );
   }
   updateElementReturnToSupplierDetail(Id, Column, Value) : Observable<any>{
     return this.http.get<any>(_url+'updateElementReturnToSupplierDetail/'+Id+'/'+Column+'/'+Value, this.BranchId );
   }
 
   saveAsPendingReturnToSupplierByTransCode(transCode) : Observable<any>{
     return this.http.get<any>(_url+'saveAsPendingReturnToSupplierByTransCode/'+transCode, this.BranchId );
   }
   backToOngoingReturnToSupplierByTransCode(transCode) : Observable<any>{
     return this.http.get<any>(_url+'backToOngoingReturnToSupplierByTransCode/'+transCode, this.BranchId );
   }
   deleteAllReturnToSupplierHeadersPending() : Observable<any>{
     return this.http.get<any>(_url+'deleteAllReturnToSupplierHeadersPending', this.BranchId );
   }
}
