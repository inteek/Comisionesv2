using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OneCoreData.Models
{
    class retencionesModel
    {
        public string Name { get; set; }
        
        public string EmailSend { get; set; }
        
        public string Server { get; set; }
        
        public string Port { get; set; }
        
        public string Password { get; set; }

        public bool Auth { get; set; }

        public bool SSL { get; set; }
        
        public string EmailDestination { get; set; }
    }
}
