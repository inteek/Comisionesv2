using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class Patentes
    {
        public int IdEmpresa { get; set; }
        public string Empresa { get; set; }
        public string IdPatente { get; set; }
        public string Descripcion { get; set; }
        public bool Activo { get; set; }
        public string UsuarioAlta { get; set; }
        public string UsuarioModifica { get; set; }
        public DateTime FechaAlta { get; set; }
        public DateTime? FechaModifica { get; set; }


        public string IdPatenteOld { get; set; }
    }

}