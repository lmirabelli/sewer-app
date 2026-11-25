import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date | undefined): string {
    if (!value) return '';

    const fecha = new Date(value);
    const ahora = new Date();
    const diferenciaSegundos = Math.floor((ahora.getTime() - fecha.getTime()) / 1000);

    if (diferenciaSegundos < 60) {
      return 'Hace un momento';
    } else if (diferenciaSegundos < 3600) {
      const minutos = Math.floor(diferenciaSegundos / 60);
      return `Hace ${minutos} minuto${minutos === 1 ? '' : 's'}`;
    } else if (diferenciaSegundos < 86400) {
      const horas = Math.floor(diferenciaSegundos / 3600);
      return `Hace ${horas} hora${horas === 1 ? '' : 's'}`;
    } else {
      const dias = Math.floor(diferenciaSegundos / 86400);
      return `Hace ${dias} día${dias === 1 ? '' : 's'}`;
    }
  }
}