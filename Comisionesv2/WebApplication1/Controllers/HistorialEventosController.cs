using OneCoreData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication1.Controllers
{
    public class HistorialEventosController : Controller
    {
        private IList<com_bitacora> ObtenerEventos()
        {
            try
            {
                List<com_bitacora> listaEvento = new List<com_bitacora>();
                using (COMISIONESEntities dataBase = new COMISIONESEntities())
                {
                    listaEvento = dataBase.com_bitacora.OrderByDescending(p=> p.id).ToList();
                }
                if (listaEvento != null)
                    return listaEvento;
                else
                    return new List<com_bitacora>();
            }
            catch (Exception ex)
            {
                return new List<com_bitacora>();
                throw;
            }
        }

        // GET: HistorialEventos
        [ActionName("Historial")]
        public ActionResult Index()
        {
            //IEnumerable<historialEventos> results = ObtenerEventos();
            return View("~/Views/HistorialEventos/Index.cshtml", ObtenerEventos());
        }
    }
}