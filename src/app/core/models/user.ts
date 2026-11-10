export interface UserRegisterDto {
    nombre: string;
    apellido: string;
    username: string;
    email: string;
    password?: string;
    fechaNacimiento: string;
    descripcionBreve?: string;
    perfil: 'usuario' | 'administrador';
    avatar?: string;
}

export interface User {
    id: string;
    nombre: string;
    email: string;
    perfil: 'usuario' | 'administrador';
}

export interface AuthResponse {
    mensaje: string;
    access_token: string;
    usuario: User;
}

export interface UserProfile {
    id?: string;
    nombre: string;
    email: string;
    perfil: 'usuario' | 'administrador';
    avatar?: string;
}