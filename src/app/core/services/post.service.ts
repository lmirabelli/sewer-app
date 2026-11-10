import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { environment } from '../../../enviroment/enviroment';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiUrl = `${environment.backendUrl}/posts`;

    constructor(private http: HttpClient) { }

    getPosts(filtros?: { orden?: string; usuarioId?: string; limit?: number; offset?: number }): Observable<Post[]> {
        let params = new HttpParams();
        if (filtros?.orden) params = params.set('orden', filtros.orden);
        if (filtros?.usuarioId) params = params.set('usuarioId', filtros.usuarioId);
        if (filtros?.limit) params = params.set('limit', filtros.limit.toString());
        if (filtros?.offset) params = params.set('offset', filtros.offset.toString());

        return this.http.get<Post[]>(this.apiUrl, { params });
    }

    createPost(contenido: string, imagen?: string): Observable<Post> {
        return this.http.post<Post>(this.apiUrl, { contenido, imagen });
    }

    toggleLike(postId: string): Observable<Post> {
        return this.http.patch<Post>(`${this.apiUrl}/${postId}/like`, {});
    }

    addComment(postId: string, texto: string): Observable<Post> {
        return this.http.post<Post>(`${this.apiUrl}/${postId}/comments`, { texto });
    }

    deletePost(postId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${postId}`);
    }
}