import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  constructor(private http: HttpClient) {}

  getEstadisticas(desde: string, hasta: string): Observable<any> {
    const url = `${environment.backendUrl}/stats/dashboard?desde=${desde}T00:00:00.000Z&hasta=${hasta}T23:59:59.999Z`;
    return this.http.get<any>(url);
  }
}