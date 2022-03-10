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
using Neo4jClient;

namespace zavrsni_rad_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class findPeopleController : ControllerBase
    {
        private IGraphClient _client;

        [HttpGet]
        [Route("[action]/{username}/{search}")]
        public async Task<ActionResult> findPeople1(string username, string search)
        {
            var driver = GraphDatabase.Driver("neo4j://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
            _client = new BoltGraphClient(driver);
            await _client.ConnectAsync();

            List<User> result = (List<User>)await _client.Cypher.WithDatabase("graph.db")
                                    .Match("(b:Person)<-[:FOLLOW]-(a:Person)")
                                    .Where((User a) => a.name == username)
                                    .AndWhere("b.ime_prezime=~'(?i).*" + search + ".*'")
                                    .Return(b => b.As<User>())
                                    .Union()
                                    .Match("(a:Person),(b:Person),(c:TehnologijeIJezici)<-[:A_PART_OF *0..]-(d)")
                                    .Where((User a) => a.name == username)
                                    .AndWhere("c.name=~'(?i)" + search + ".*' and (a)-[:FOLLOW]->(b) and (b)-[:ZNA]->(d)")
                                    .Return(b => b.As<User>()).ResultsAsync;
            return Ok(result);
        }

        [HttpGet]
        [Route("[action]/{username}/{search}")]
        public async Task<ActionResult> findPeople2(string username, string search)
        {
            var driver = GraphDatabase.Driver("neo4j://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
            _client = new BoltGraphClient(driver);
            await _client.ConnectAsync();

            List<User> result = (List<User>)await _client.Cypher.WithDatabase("graph.db")
                                    .Match("(b:Person),(a:Person)")
                                    .Where((User a) => a.name == username)
                                    .AndWhere("not (a)-[:FOLLOW]->(b) and b.ime_prezime=~'(?i).*" + search + ".*'")
                                    .Return(b => b.As<User>())
                                    .Union()
                                    .Match("(a:Person),(b:Person),(c:TehnologijeIJezici)<-[:A_PART_OF *0..]-(d)")
                                    .Where((User a) => a.name == username)
                                    .AndWhere("not (a)-[:FOLLOW]->(b) and (b)-[:ZNA]->(d) and c.name=~'(?i)" + search + ".*'")
                                    .Return(b => b.As<User>()).ResultsAsync;
            return Ok(result);
        }

        [HttpGet]
        [Route("[action]/{username}/{search}")]
        public async Task<ActionResult> findPeople3(string username, string search)
        {
            var driver = GraphDatabase.Driver("neo4j://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
            _client = new BoltGraphClient(driver);
            await _client.ConnectAsync();

            List<User> result = (List<User>)await _client.Cypher.WithDatabase("graph.db")
                                    .Match("(a:Person)-[:FOLLOW]->(b:Person),(b)-[:FOLLOW]->(c:Person)")
                                    .Where((User a) => a.name == username)
                                    .AndWhere("c.ime_prezime=~'(?i).*" + search + ".*'")
                                    .Return(c => c.As<User>())
                                    .Union()
                                    .Match("(a:Person)-[:FOLLOW]->(b:Person),(b)-[:FOLLOW]->(c:Person),(e:TehnologijeIJezici"
                                        + ")<-[:A_PART_OF *0..]-(d),(c)-[:ZNA]->(d)")
                                    .Where((User a) => a.name == username)
                                    .AndWhere("e.name=~'(?i)" + search + ".*'")
                                    .Return(c => c.As<User>()).ResultsAsync;
            return Ok(result);
        }

        [HttpGet]
        [Route("[action]/{username}/{search}")]
        public async Task<ActionResult> findPeople4(string username, string search)
        {
            var driver = GraphDatabase.Driver("neo4j://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
            _client = new BoltGraphClient(driver);
            await _client.ConnectAsync();

            List<User> result = (List<User>)await _client.Cypher.WithDatabase("graph.db")
                                    .Match("(a:Person)-[:FOLLOW]->(b:Person {company:TRUE}),(b)<-[:RADI_U]-(c:Person)")
                                    .Where((User a) => a.name == username)
                                    .AndWhere("c.ime_prezime=~'(?i).*" + search + ".*'")
                                    .Return(c => c.As<User>())
                                    .Union()
                                    .Match("(a:Person)-[:FOLLOW]->(b:Person {company:TRUE}),(b)<-[:RADI_U]-(c:Person),(e:TehnologijeIJezici"
                                        + ")<-[:A_PART_OF *0..]-(d),(c)-[:ZNA]->(d)")
                                    .Where((User a) => a.name == username)
                                    .AndWhere("e.name=~'(?i)" + search + ".*'")
                                    .Return(c => c.As<User>()).ResultsAsync;
            return Ok(result);
        }
    }
}