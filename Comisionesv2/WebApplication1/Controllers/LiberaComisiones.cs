using System.Collections.Generic;

namespace WebApplication1.Controllers
{
    public class LiberaComisiones
    {
        //private string nombre;
        //public string Nombre
        //{
        //    get
        //    {
        //        return  nombre;
        //    }

        //    set
        //    {
        //        nombre = value;
        //    }
        //}

        public string Nombre { get; set; }
    }

    public class ComisionesLiberadas
    {
        public ComisionesLiberadas()
        {
            data = new List<LiberaComisiones>();
        }

        public List<LiberaComisiones> data;
    }
}