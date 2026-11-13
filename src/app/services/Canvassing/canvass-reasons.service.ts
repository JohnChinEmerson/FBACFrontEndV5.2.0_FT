import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class CanvassReasonsService {
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
     private toolbox : ToolBoxService,
   ) { 
     this.BranchId ={ headers: this.branch};
   }
 
   get requiredRefresh(){
     return this._refreshrequired;
   }
   
   getCBOCanvassReasons() : Observable<any>{
     return this.http.get<any>(_url+'getCBOCanvassReasons',this.BranchId );
   }
   getCanvassReasonsToDisplay() : Observable<any>{
     return this.http.get<any>(_url+'getCanvassReasonsToDisplay',this.BranchId );
   }
 
   getCanvassReasonByReasonId(ReasonId) : Observable<any>{
     return this.http.get<any>(_url+'getCanvassReasonByReasonId/'+ReasonId,this.BranchId );
   }
 
   saveCanvassReason(data: any) : Observable<any>{
     return this.http.post<any>(_url+'saveCanvassReason',data,this.BranchId ).pipe(
       tap(()=>{
         this.requiredRefresh.next();
       })
     );
   }
 
   deleteCanvassReason(id) : Observable<any>{
     return this.http.get<any>(_url+'deleteCanvassReason/'+id,this.BranchId ).pipe(
       tap(()=>{
         this.requiredRefresh.next();
       })
     );
   }
}
