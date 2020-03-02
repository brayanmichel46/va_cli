export class CliCliente {
  constructor(
    public nombre: string,
    public identificacion: string,
    public direccion: string,
    public email: string,
    public telefono: string,
    public celular: string,
    public img: string,
    public ban_editar: boolean,
    public id_cliente?: number,
    public id_persona?: number,

) { }
}
