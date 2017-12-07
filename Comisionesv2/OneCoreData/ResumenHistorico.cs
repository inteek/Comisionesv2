using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneCoreData
{
    public class ResumenHistorico
    {
        public int ID_EMPRESA { get; set; }
        public string NOMBRE_EMPRESA { get; set; }
        public string ID_CLIENTE { get; set; }
        public string NOMBRE_CLIENTE { get; set; }
        public int DIAS_CREDITO { get; set; }
        public int DIAS_RETENCION { get; set; }
        public int DIAS_GRACIA { get; set; }
        public int PERIODO { get; set; }
    }
}
