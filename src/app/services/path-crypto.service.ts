import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PathCryptoService {

  encodePath(path: string): string {
    return btoa(path); // Use AES here for stronger security
  }

  decodePath(encoded: string): string {
    return atob(encoded);
  }
}
