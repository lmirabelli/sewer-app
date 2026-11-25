import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { EstadisticasService } from '../../../../core/services/estadisticas.services';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './estadisticas.html',
  styleUrls: ['./estadisticas.css']
})
export class Estadisticas implements OnInit {
  fechaDesde: string = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  fechaHasta: string = new Date().toISOString().split('T')[0];
  cargando = false;

  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  constructor(
    private statsService: EstadisticasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargando = true;
    
    this.statsService.getEstadisticas(this.fechaDesde, this.fechaHasta).subscribe({
      next: (data) => {
        this.procesarDatos(data);
        this.cargando = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al cargar estadísticas', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private procesarDatos(data: any): void {
    this.pieChartData = {
      labels: data.postsPorUsuario.map((p: any) => p.username),
      datasets: [{
        data: data.postsPorUsuario.map((p: any) => p.cantidad),
        backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
      }]
    };

    this.barChartData = {
      labels: data.comentariosPorPublicacion.map((p: any) => p.titulo || 'Sin título'),
      datasets: [{
        data: data.comentariosPorPublicacion.map((p: any) => p.cantidad),
        label: 'Cantidad de Comentarios',
        backgroundColor: '#3b82f6'
      }]
    };

    this.lineChartData = {
      labels: data.comentariosPorFecha.map((p: any) => p._id),
      datasets: [{
        data: data.comentariosPorFecha.map((p: any) => p.cantidad),
        label: 'Comentarios por día',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.3
      }]
    };
  }
}