import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleColor',
  standalone: true
})
export class RoleColorPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return 'text-slate-400';
    return value === 'admin' ? 'text-purple-400 font-bold uppercase' : 'text-blue-400 font-medium';
  }
}