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

namespace zavrsni_rad_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TehnologijeIJeziciController : ControllerBase
    {
        private readonly ILogger<TehnologijeIJeziciController> _logger;
        private readonly IDriver _driver;

        public TehnologijeIJeziciController(ILogger<TehnologijeIJeziciController> logger, IDriver driver)
        {
            _logger = logger;
            _driver = driver;
        }

        [HttpGet]   // showAllTechnologies() showTechnologies()
        public async Task<ActionResult> Get()
        {
            IResultCursor cursor;
            var people = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:TehnologijeIJezici) RETURN n.name AS name");
                people = await cursor.ToListAsync(record => record["name"].As<string>());
            }

            return Ok(people);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult> showMyTechnologies(string username)
        {
            IResultCursor cursor;
            var people = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:TehnologijeIJezici)<-[r:ZNA]-(p:Person {name:'" + username
                   + "'}) RETURN n.name AS name");
                people = await cursor.ToListAsync(record => record["name"].As<string>());
            }

            return Ok(people);
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> addTechnologies(TehnologijeIJezici tij, string username)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (a:Person {name:'" + username
                    + "'}),(b:TehnologijeIJezici {name:'" + tij.name + "'}) MERGE (a)-[r:ZNA]->(b) RETURN r LIMIT 1");
            }

            return Ok("Added Successfully!");
        }

        [HttpPost]
        public async Task<ActionResult> addNewTechnology(TehnologijeIJezici tij)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MERGE (n:TehnologijeIJezici {name:'" + tij.name + "'}) return n");
            }

            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (a:TehnologijeIJezici {name:'" + tij.name
                    + "'}) MATCH (b:TehnologijeIJezici {name:'" + tij.selectedName
                    + "'}) MERGE (a)-[r:A_PART_OF]->(b) return r limit 1");
            }

            return Ok("Added Successfully!");
        }

        [HttpDelete("{username}")]
        public async Task<ActionResult> deleteTechnologies(TehnologijeIJezici tij, string username)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:Person {name:'" + username
                    + "'})-[r:ZNA]->(t:TehnologijeIJezici {name:'" + tij.name + "'}) delete r");
            }

            return Ok("Deleted Successfully!");
        }

        [HttpDelete]
        public async Task<ActionResult> deleteTechnology(TehnologijeIJezici tij)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:TehnologijeIJezici {name:'" + tij.name
                        + "'})-[r:A_PART_OF]->() DELETE r");
            }

            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:TehnologijeIJezici {name:'" + tij.name + "'}) DELETE n");
            }

            return Ok("Deleted Successfully!");
        }
    }
}