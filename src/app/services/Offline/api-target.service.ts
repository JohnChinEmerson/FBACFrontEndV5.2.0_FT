import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RuntimeConfigService } from './runtime-config.service';

export type ApiTarget = 'cloud' | 'local';

// Which backend the app is currently using. Only a branch deployment can use 'local'.
@Injectable({
  providedIn: 'root'
})
export class ApiTargetService {

  private readonly storageKey = 'ApiTarget';
  private _targetChanged = new Subject<ApiTarget>();

  constructor(private runtimeConfig: RuntimeConfigService) { }

  get targetChanged() {
    return this._targetChanged;
  }

  get target(): ApiTarget {
    if (!this.runtimeConfig.isBranch) return 'cloud';
    return localStorage.getItem(this.storageKey) === 'local' ? 'local' : 'cloud';
  }

  get baseUrl(): string {
    const config = this.runtimeConfig.config;
    return this.target === 'local' ? config.localApiUrl : config.cloudApiUrl;
  }

  setTarget(target: ApiTarget) {
    localStorage.setItem(this.storageKey, target);
    this._targetChanged.next(this.target);
  }
}
