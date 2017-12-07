using OneCoreData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class Utils
    {
        public class Pie_tabla
        {
            public string IDusuario = HttpContext.Current.Session["UserID"].ToString();
            public string LoginUsuario = HttpContext.Current.Session["UserName"].ToString();
            public DateTime f_actual = DateTime.Now;
        }

        
    }
}