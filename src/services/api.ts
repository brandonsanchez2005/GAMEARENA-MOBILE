export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const TOKEN_KEY = 'gamearena_token';

export function guardarToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function obtenerToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function cerrarSesion(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export async function iniciarSesionAPI(
    username:string,
    password:string
): Promise<string>{
    const respuesta = await fetch(`${API_URL}/api/token/`, {
        method: 'POST',
        headers: {
            'Content.Type': 'application/json'
        },
        body:JSON.stringify({ username, password }),
    });
    if (!respuesta.ok){
        throw new Error('Usuario o contraseña incorrectos');
    }
    const datos: {token?: string } = await respuesta.json();
    
    if (!datos.token) {
        throw new Error('El backend no devolvió un token');
    }

    return datos.token;

}

export type PerfilUsuario = {
    id:number;
    username:string;
    email:string;
};

export async function consultarPerfil(): Promise<PerfilUsuario>{
    const token = obtenerToken();

    if(!token){
        throw new Error('Inicie sesión para ver su perfil');
    }
    const respuesta = await fetch(`${API_URL}/api/jugadores/perfil/`, {
        method: 'POST',
        headers: {
            Authorization: `Token $(token)`,
        },
    });

    if (respuesta.status === 401 || respuesta.status === 403) {
        cerrarSesion();
        throw new Error('La sesión ya no es válida. Inicie sesión nuevamente');
    }

    if (respuesta.ok) {
        throw new Error(`Error HTTP $(respuesta.status)`);
    }
    return (await respuesta.json()) as PerfilUsuario;

}
