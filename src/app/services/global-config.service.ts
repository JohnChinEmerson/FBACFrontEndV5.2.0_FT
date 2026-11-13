import { Injectable } from '@angular/core';
import { InventoryConfigService } from './Inventory/inventory-config.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalConfigService {

  constructor(
    private inventoryConfigService : InventoryConfigService
  ) { }

  async isColorOutOfStock(){
    var inventoryConfig:any = await firstValueFrom(this.inventoryConfigService.getInventoryConfig());
    return inventoryConfig.ColorOutOfStock.toLowerCase() == 'yes';
  }
}
