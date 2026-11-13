import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class ClientLicenseService {
  constructor(
    private http: HttpClient,
  ) { 
  }

  getHostName() : Observable<any>{
    return this.http.get<any>(_url+'getHostName');
  }
  getSoftwares() : Observable<any>{
    return this.http.get<any>(_url+'getSoftwares');
  }
  getClientLicense() : Observable<any>{
    return this.http.get<any>(_url+'getClientLicense');
  }
  getTechSupportsBySoftwareTypeId(softwareTypeId) : Observable<any>{
    return this.http.get<any>(_url+'getTechSupportsBySoftwareTypeId/'+softwareTypeId);
  }
  saveEditClientLicense(data) : Observable<any>{
    return this.http.post<any>(_url+'saveEditClientLicense',data);
  }
}
