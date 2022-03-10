using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using zavrsni_rad_backend.Models;
using Neo4j.Driver;
using Microsoft.Extensions.Logging;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Neo4jClient;

namespace zavrsni_rad_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly ILogger<PersonController> _logger;
        private readonly IDriver _driver;
        private readonly IWebHostEnvironment _env;

        private IGraphClient _client;

        public PersonController(ILogger<PersonController> logger, IDriver driver, IWebHostEnvironment env)
        {
            _logger = logger;
            _driver = driver;
            _env = env;
        }

        [HttpGet("{username}/{password}")]
        public async Task<ActionResult> submitLogin(string username, string password)
        {
            var driver = GraphDatabase.Driver("neo4j://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
            _client = new BoltGraphClient(driver);
            await _client.ConnectAsync();
            
            List<User> result = (List<User>) await _client.Cypher.WithDatabase("graph.db").Match("(n:Person)")
                                                  .Where((User n) => n.name == username)
                                                  .Return(n => n.As<User>()).ResultsAsync;
            return Ok(result);
        }

        [HttpPost]
        [Route("SaveFile/{username}/{photoName}")]
        public async Task<ActionResult> SaveFile(string username, string photoName)
        {
            try
            {
                Guid guid = Guid.NewGuid();
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string fileName = username + guid + ".png";
                var physicalPath = _env.ContentRootPath + "/Photos/" + fileName;

                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }

                if (photoName != "default.png")
                {
                    var path = _env.ContentRootPath + "/Photos/" + photoName;
                    System.IO.File.Delete(path);
                }

                IResultCursor cursor;
                var result = new List<string>();
                using (var session = _driver.AsyncSession())
                {
                    cursor = await session.RunAsync(@"MATCH (n:Person) where n.name='" + username
                        + "' set n.picture='" + fileName + "' RETURN n");
                }

                result.Add(fileName);
                return Ok(result);
            }
            catch (Exception e)
            {
                return Ok(e);
            }
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult> submitRegister(Person person)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:Person) where n.name='" + person.username + "' RETURN n.name AS name");
                result = await cursor.ToListAsync(record => record["name"].As<string>());
            }

            if (result.Count == 0)
            {
                using (var session = _driver.AsyncSession())
                {
                    cursor = await session.RunAsync(@"CREATE (n:Person {ime:'" + person.name
                        + "', prezime:'" + person.surname + "', name:'" + person.username
                        + "', ime_prezime:'" + person.name + " " + person.surname
                        + "', password:'" + person.password + "', datum_rodj:'" + person.datum_rodj
                        + "', mesto_rodj:'" + person.mesto_rodj + "', pol:'" + person.pol
                        + "', picture:'default.png', company: false}) RETURN n");
                }

                return Ok("Added Successfully!");
            }
            else
            {
                return Ok("This username is occupied! Try another.");
            }
        }

        [HttpPost]
        [Route("[action]/{username}")]
        public async Task<ActionResult> addFollow(Person person, string username)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (a:Person),(b:Person) WHERE a.name = '" + username
                    + "' AND b.name = '" + person.username + "' MERGE (a)-[r:FOLLOW]->(b) RETURN r LIMIT 1");
            }

            return Ok("Added Successfully!");
        }

        [HttpPut]
        [Route("[action]")]
        public async Task<ActionResult> submitNameChange(Person person)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:Person) where n.name='" + person.username
                    + "' set n.ime='" + person.name + "', n.ime_prezime='"
                    + person.name + " " + person.surname + "' RETURN n.ime AS ime");
                result = await cursor.ToListAsync(record => record["ime"].As<string>());
            }

            return Ok(result);
        }

        [HttpPut]
        [Route("[action]")]
        public async Task<ActionResult> submitSurnameChange(Person person)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:Person) where n.name='" + person.username
                    + "' set n.prezime='" + person.surname + "', n.ime_prezime='"
                    + person.name + " " + person.surname + "' RETURN n.prezime AS prezime");
                result = await cursor.ToListAsync(record => record["prezime"].As<string>());
            }

            return Ok(result);
        }

        [HttpPut]
        [Route("[action]")]
        public async Task<ActionResult> submitPasswordChange(Person person)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:Person) where n.name='" + person.username 
                    + "' set n.password='" + person.password + "' RETURN n.password AS password");
                result = await cursor.ToListAsync(record => record["password"].As<string>());
            }

            return Ok(result);
        }

        [HttpDelete]
        [Route("[action]/{username}")]
        public async Task<ActionResult> deleteFollow(Person person, string username)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (a:Person {name: '" + username
                    + "'})-[r:FOLLOW]->(b:Person {name: '" + person.username + "'}) DELETE r");
            }

            return Ok("Deleted Successfully!");
        }
    }
}