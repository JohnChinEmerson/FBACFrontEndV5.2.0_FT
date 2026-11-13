import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SerialNosService {

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

  getSerialNosByItemIdByRecordStatus(itemId, recordStatus) : Observable<any>{
    return this.http.get<any>(_url+'getSerialNosByItemIdByRecordStatus/'+itemId+'/'+recordStatus,this.BranchId);
  }
  getSerialNosByItemIdBySerialNo(itemId, serialNo) : Observable<any>{
    return this.http.get<any>(_url+'getSerialNosByItemIdBySerialNo/'+itemId+'/'+serialNo,this.BranchId);
  }
  getSerialNosByItemIdBySerialNoByTransDetailIdByTransName(itemId, serialNo, sDetailId, transName) : Observable<any>{
    return this.http.get<any>(_url+'getSerialNosByItemIdBySerialNoByTransDetailIdByTransName/'+itemId+'/'+serialNo+'/'+sDetailId+'/'+transName,this.BranchId);
  }
  loadSerialNosByItemId(itemId) : Observable<any>{
    return this.http.get<any>(_url+'loadSerialNosByItemId/'+itemId,this.BranchId);
  }
  
  loadSerialNosByTransDetailIdByTransName(sDetailId,transName) : Observable<any>{
    return this.http.get<any>(_url+'loadSerialNosByTransDetailIdByTransName/'+sDetailId+'/'+transName,this.BranchId);
  }
  saveSerialNos(data) : Observable<any>{
    return this.http.post<any>(_url+'saveSerialNos',data,this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
  deleteSerialNo(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteSerialNo/'+id, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
 
}
