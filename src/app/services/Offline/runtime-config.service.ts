import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { _url } from 'src/global-variables';

export interface RuntimeConfig {
  node        : 'cloud' | 'branch';   // 'branch' = app served by the branch server
  cloudApiUrl : string;
  localApiUrl : string;
}

// Loaded once at startup from assets/runtime-config.json, so the same build
// can be deployed to the cloud and to every branch server.
@Injectable({
  providedIn: 'root'
})
export class RuntimeConfigService {

  config: RuntimeConfig = { node: 'cloud', cloudApiUrl: _url, localApiUrl: '' };

  // HttpBackend skips the interceptors, which depend on this config
  constructor(private httpBackend: HttpBackend) { }

  async load(): Promise<void> {
    try {
      const http = new HttpClient(this.httpBackend);
      const cfg  = await firstValueFrom(http.get<Partial<RuntimeConfig>>('assets/runtime-config.json?v=' + Date.now()));
      this.config = {
        node        : cfg.node === 'branch' ? 'branch' : 'cloud',
        cloudApiUrl : this.withSlash(cfg.cloudApiUrl) || _url,
        localApiUrl : this.withSlash(cfg.localApiUrl),
      };
    } catch {
      // No config file: behave exactly like the cloud build
    }
  }

  get isBranch(): boolean {
    return this.config.node === 'branch' && this.config.localApiUrl !== '';
  }

  private withSlash(url?: string): string {
    if (!url) return '';
    return url.endsWith('/') ? url : url + '/';
  }
}
