export interface Comentario {
    _id?: string;
    usuario: {
        _id: string;
        username: string;
        avatar?: string;
    };
    texto: string;
    createdAt: string | Date;
}

export interface Post {
    _id?: string;
    autor: {
        _id: string;
        username: string;
        avatar?: string;
    };
    contenido: string;
    imagen?: string;
    likes: string[];
    comentariosCount: number;
    comentarios?: Comentario[];
    createdAt: string | Date;
}