import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class SignaturesService {

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
 
   
    getSignaturesByTransNoByTable(transNo,indexTable) : Observable<any>{
        return this.http.get<any>(_url+'getSignaturesByTransNoByTable/'+transNo+'/'+indexTable,this.BranchId);
    }
    setSignatures(signatures) : Observable<any>{
        return this.http.get<any>(_url+'setSignatures/'+signatures,this.BranchId);
    }

    saveEditSignatures(data: any,btnText, transNo) : Observable<any>{
      return this.http.post<any>(_url+'saveEditSignatures/'+btnText+'/'+transNo,data,this.BranchId ).pipe(
        tap(()=>{
          this.requiredRefresh.next();
        })
      );
    }

    deleteSignature(id, transNo, transTable) : Observable<any>{
    return this.http.get<any>(_url+'deleteSignature/'+id+'/'+transNo+'/'+transTable,this.BranchId ).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
  
}
