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
    public class AboutController : ControllerBase
    {
        private readonly ILogger<AboutController> _logger;
        private readonly IDriver _driver;

        public AboutController(ILogger<AboutController> logger, IDriver driver)
        {
            _logger = logger;
            _driver = driver;
        }
        
        [HttpGet("{username}")]
        public async Task<ActionResult> showAbout(string username)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (a:About)-[r:OPISUJE]->(p:Person {name:'" + username
                    + "'}) RETURN a.description AS description");
                result = await cursor.ToListAsync(record => record["description"].As<string>());
            }

            return Ok(result);
        }

        [HttpPut]
        public async Task<ActionResult> updateAbout(About about)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MERGE (a:About {username:'" + about.username + "'}) RETURN a");
                //result = await cursor.ToListAsync(record => record["description"].As<string>());
            }

            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (a:About {username:'" + about.username
                    + "'}), (p:Person {name:'" + about.username + "'}) MERGE (a)-[r:OPISUJE]->(p) return r");
                //result = await cursor.ToListAsync(record => record["description"].As<string>());
            }

            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (a:About {username:'" + about.username
                    + "'}) SET a.description = '" + about.description + "' return a");
                //result = await cursor.ToListAsync(record => record["description"].As<string>());
            }

            return Ok("Updated Successfully!");
        }
    }
}