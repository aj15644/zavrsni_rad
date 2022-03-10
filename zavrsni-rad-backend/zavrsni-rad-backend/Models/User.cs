using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace zavrsni_rad_backend.Models
{
    public class User
    {
        public bool company { get; set; }
        public string datum_rodj { get; set; }
        public string ime { get; set; }
        public string ime_prezime { get; set; }
        public string mesto_rodj { get; set; }
        public string name { get; set; }
        public string password { get; set; }
        public string picture { get; set; }
        public string pol { get; set; }
        public string prezime { get; set; }

        public string date_of_establishment { get; set; }
        public string location { get; set; }

        public List<TehnologijeIJezici> tehnologijeIJezici { get; set; }
        public List<Mail> mail { get; set; }
        public List<Telefon> telefon { get; set; }
        public List<About> about { get; set; }
    }
}
