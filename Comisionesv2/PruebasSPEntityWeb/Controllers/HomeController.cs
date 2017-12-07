using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PruebasSPEntityWeb.Controllers
{
    public class HomeController : Controller
    {
        private COMISIONESEntities db = new COMISIONESEntities();

        public ActionResult Index()
        {
            try
            {
                DateTime dtInicio = new DateTime(2017, 03, 01);
                DateTime dtFin = new DateTime(2017, 03, 30);
                var query = db.csp_ConsultarFacturas(1, "ELI", "23", 1, dtInicio, dtFin, "0003,7921");
            }
            catch (Exception ex)
            {
                var errror = ex.ToString();
                throw;
            }
            
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}