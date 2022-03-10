using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace zavrsni_rad_backend.Models
{
    public class Company
    {
        public string ime { get; set; }
        public string ime_prezime { get; set; }
        public string name { get; set; }
        public string password { get; set; }
        public string date_of_establishment { get; set; }
        public string location { get; set; }
        public bool company { get; set; }
        public string personUsername { get; set; }
        public string date_of { get; set; }
    }
}
