import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToTime',
  standalone: true,
})
export class MinutesToTimePipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    if (value == null || isNaN(value)) return '00:00';

    const totalSeconds = Math.round(value * 60); // convert minutes to seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = hours > 0 ? String(hours).padStart(1, '0') + ':' : '';
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    return `${hh}${mm}:${ss}`;
  }

}
