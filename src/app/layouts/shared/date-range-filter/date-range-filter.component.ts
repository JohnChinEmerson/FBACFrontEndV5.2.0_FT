import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface DateRange { from: Date; to: Date; preset: string; }

// Date range of the Dashboard and the Command Center: a preset fills From / To, or any dates in From / To.
// rangeChange fires on a preset and on a date change, never on start: the parent loads its first range
// (DateRangeFilterComponent.rangeOf(preset)) itself.
@Component({
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.css']
})
export class DateRangeFilterComponent implements OnInit {
  @Input() preset: string = 'today';
  @Input() disabled: boolean = false;
  @Output() rangeChange = new EventEmitter<DateRange>();
  presets = [
    { Label: 'Today', Value: 'today' },
    { Label: 'This Week', Value: 'week' },
    { Label: 'This Month', Value: 'month' },
  ];
  dateFrom: Date;
  dateTo: Date;

  // the dates of a preset (a week starts on Monday)
  static rangeOf(preset: string): DateRange {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var from = new Date(today), to = new Date(today);
    if (preset == 'week') from.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    if (preset == 'month') from.setDate(1);
    return { from: from, to: to, preset: preset };
  }

  ngOnInit(): void {
    var range = DateRangeFilterComponent.rangeOf(this.preset);
    this.dateFrom = range.from;
    this.dateTo = range.to;
  }

  select(value: string){
    var range = DateRangeFilterComponent.rangeOf(value);
    this.preset = value;
    this.dateFrom = range.from;
    this.dateTo = range.to;
    this.emit();
  }

  // a date typed or picked: no preset highlighted ('custom'); From after To moves the other date along
  onDateChange(changed: 'from' | 'to'){
    if (!this.dateFrom || !this.dateTo || isNaN(new Date(this.dateFrom).getTime()) || isNaN(new Date(this.dateTo).getTime())) return;
    if (new Date(this.dateFrom) > new Date(this.dateTo)) {
      if (changed == 'from') this.dateTo = new Date(this.dateFrom);
      else this.dateFrom = new Date(this.dateTo);
    }
    this.preset = 'custom';
    this.emit();
  }

  private emit(){
    this.rangeChange.emit({ from: new Date(this.dateFrom), to: new Date(this.dateTo), preset: this.preset });
  }
}
