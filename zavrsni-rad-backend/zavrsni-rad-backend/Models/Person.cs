using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Serialization;

namespace zavrsni_rad_backend.Models
{
    public class Person
    {
        //public string PeopleId { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string name { get; set; }
        public string surname { get; set; }
        public string ime_prezime { get; set; }
        public string mesto_rodj { get; set; }
        public string datum_rodj { get; set; }
        public string pol { get; set; }
        public string picture { get; set; }
        public bool company { get; set; }
    }
}
