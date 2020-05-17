export class CliCliente {
  constructor(
    public direccion: string,
    public email: string,
    public celular: string,
    public telefono: string,
    public img?: string,
    public nombre?: string,
    public identificacion?: string,
    public id_cliente?: number,
    public id_persona?: number,
    public ban_editar?: boolean
) { }
}
