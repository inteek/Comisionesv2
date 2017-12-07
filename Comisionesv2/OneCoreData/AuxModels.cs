using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OneCoreData
{
    public partial class AA140210
    {
        public string ConcatAduana
        {
            get { return CUSTOM.Trim() + SECTION + " - " + DENOMC; }
        }

    }

    public partial class CATCLAVE_PEDIMENTO
    {
        public string ConcatPedimento
        {
            get { return Clave.Trim() + " - " + Descripcion; }
        }

    }
}
