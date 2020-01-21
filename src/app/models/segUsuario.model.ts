export class SegUsuario {
    constructor(
        public nombre: string,
        public email: string,
        public password: string,
        public estado?: string,
        public img?: string,
        public google?: boolean,
        public id_usuario?: number,
        public id_persona?: number,
    ) { }
}
