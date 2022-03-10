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
    public class ShowPersonController : ControllerBase
    {
        private IGraphClient _client;

        [HttpGet]
        [Route("[action]/{username}")]
        public async Task<ActionResult> showFollowPeople(string username)
        {
            var driver = GraphDatabase.Driver("neo4j://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
            _client = new BoltGraphClient(driver);
            await _client.ConnectAsync();

            List<User> result = (List<User>)await _client.Cypher.WithDatabase("graph.db")
                                                  .Match("(a:Person)-[r:FOLLOW]->(b:Person)")
                                                  .Where((User a) => a.name == username)
                                                  .Return(b => b.As<User>()).ResultsAsync;
            return Ok(result);
        }

        [HttpGet]
        [Route("[action]/{username}")]
        public async Task<ActionResult> showFriendFollowPeople(string username)
        {
            var driver = GraphDatabase.Driver("neo4j://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
            _client = new BoltGraphClient(driver);
            await _client.ConnectAsync();

            List<User> result = (List<User>)await _client.Cypher.WithDatabase("graph.db")
                                                  .Match("(a:Person)-[:FOLLOW]->(b:Person) MATCH (b)-[:FOLLOW]->(c:Person)")
                                                  .Where((User a) => a.name == username)
                                                  .Return(c => c.As<User>()).ResultsAsync;
            return Ok(result);
        }

        [HttpGet]
        [Route("[action]/{username}")]
        public async Task<ActionResult> showEmployee(string username)
        {
            var driver = GraphDatabase.Driver("neo4j://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
            _client = new BoltGraphClient(driver);
            await _client.ConnectAsync();

            List<User> result = (List<User>)await _client.Cypher.WithDatabase("graph.db")
                                    .Match("(a:Person)-[:FOLLOW]->(b:Person {company: true}) MATCH (b)<-[:RADI_U]-(c:Person)")
                                    .Where((User a) => a.name == username)
                                    .Return(c => c.As<User>()).ResultsAsync;
            return Ok(result);
        }

        [HttpGet]
        [Route("[action]/{username}")]
        public async Task<ActionResult> showPeople(string username)
        {
            var driver = GraphDatabase.Driver("neo4j://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
            _client = new BoltGraphClient(driver);
            await _client.ConnectAsync();

            List<User> result = (List<User>)await _client.Cypher.WithDatabase("graph.db")
                                    .Match("(a:Person),(b:Person)")
                                    .Where((User a) => a.name == username)
                                    .AndWhere("not (a)-[:FOLLOW]->(b)")
                                    .Return(b => b.As<User>()).ResultsAsync;
            return Ok(result);
        }

        [HttpGet]
        [Route("[action]/{username}")]
        public async Task<ActionResult> showPerson(string username)
        {
            var driver = GraphDatabase.Driver("neo4j://localhost:7687", AuthTokens.Basic("neo4j", "admin"));
            _client = new BoltGraphClient(driver);
            await _client.ConnectAsync();

            List<User> resultList = (List<User>)await _client.Cypher.WithDatabase("graph.db")
                                    .Match("(n:Person)")
                                    .Where((User n) => n.name == username)
                                    .Return(n => n.As<User>()).ResultsAsync;

            User result = resultList[0];

            if (result != null)
            {
                result.tehnologijeIJezici = (List<TehnologijeIJezici>)await _client.Cypher.WithDatabase("graph.db")
                                        .Match("(p:Person)-[r:ZNA]->(t:TehnologijeIJezici)")
                                        .Where((User p) => p.name == result.name)
                                        .Return(t => t.As<TehnologijeIJezici>()).ResultsAsync;

                result.mail = (List<Mail>)await _client.Cypher.WithDatabase("graph.db")
                                        .Match("(p:Person)-[r:IMA_MAIL]->(m:Mail)")
                                        .Where((User p) => p.name == result.name)
                                        .Return(m => m.As<Mail>()).ResultsAsync;

                result.telefon = (List<Telefon>)await _client.Cypher.WithDatabase("graph.db")
                                        .Match("(p:Person)-[r:IMA_BROJ]->(te:Telefon)")
                                        .Where((User p) => p.name == result.name)
                                        .Return(te => te.As<Telefon>()).ResultsAsync;

                result.about = (List<About>)await _client.Cypher.WithDatabase("graph.db")
                                        .Match("(p:Person)<-[r:OPISUJE]-(a:About)")
                                        .Where((User p) => p.name == result.name)
                                        .Return(a => a.As<About>()).ResultsAsync;
            }

            return Ok(result);
        }
    }
}