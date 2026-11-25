import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | undefined, limite: number = 100, sufijo: string = '...'): string {
    if (!value) return '';
    if (value.length <= limite) return value;
    return value.substring(0, limite) + sufijo;
  }
}