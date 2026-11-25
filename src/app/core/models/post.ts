export interface Comentario {
    _id?: string;
    usuario: {
        _id: string;
        username: string;
        avatar?: string;
        perfil?: string;
    };
    texto: string;
    createdAt: string | Date;
    editado?: boolean;
}

export interface Post {
    _id?: string;
    autor: {
        _id: string;
        username: string;
        avatar?: string;
    };
    titulo?: string;
    cuerpo?: string;
    imagen?: string;
    likes: string[];
    comentariosCount: number;
    comentarios?: Comentario[];
    createdAt: string | Date;
}