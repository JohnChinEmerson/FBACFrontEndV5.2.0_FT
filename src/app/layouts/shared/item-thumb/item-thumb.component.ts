import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

// Item picture for the order / sales tiles and cart rows: the item's photo, or (no photo, or the image
// fails to load) a colored tile with the item's initials and a food or drink icon.
@Component({
  selector: 'app-item-thumb',
  templateUrl: './item-thumb.component.html',
  styleUrls: ['./item-thumb.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemThumbComponent implements OnChanges {
  @Input() name: string = '';
  @Input() category: string = '';
  @Input() photoUrl: string | null = null;
  // fill: covers its parent (tiles); small: 32px square (cart rows)
  @Input() size: 'fill' | 'small' = 'fill';
  failed = false;
  initials = '';
  icon = 'restaurant';
  color = '#3F51B5';

  private static readonly drinkWords = /(drink|beverage|coffee|tea|juice|soda|shake|smoothie|beer|wine|water|latte|frappe|milk|cola|coke|liquor|cocktail)/i;
  private static readonly colors = ['#3F51B5', '#00897B', '#EF6C00', '#8E24AA', '#C62828', '#2E7D32', '#5D4037', '#0277BD'];

  ngOnChanges(): void {
    this.failed = false;
    var words = (this.name || '').trim().split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w));
    this.initials = ((words[0]?.[0] || '?') + (words[1]?.[0] || '')).toUpperCase();
    this.icon = ItemThumbComponent.drinkWords.test((this.category || '') + ' ' + (this.name || '')) ? 'local_cafe' : 'restaurant';
    var hash = 0;
    for (const c of (this.name || '')) hash = (hash * 31 + c.charCodeAt(0)) | 0;
    this.color = ItemThumbComponent.colors[Math.abs(hash) % ItemThumbComponent.colors.length];
  }
}
