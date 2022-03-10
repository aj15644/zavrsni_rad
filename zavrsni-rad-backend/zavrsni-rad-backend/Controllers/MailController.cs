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
    public class MailController : ControllerBase
    {
        private readonly ILogger<MailController> _logger;
        private readonly IDriver _driver;

        public MailController(ILogger<MailController> logger, IDriver driver)
        {
            _logger = logger;
            _driver = driver;
        }

        [HttpGet("{username}")]
        public async Task<ActionResult> showMyEmail(string username)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:Mail)<-[r:IMA_MAIL]-(p:Person {name:'" + username
                    + "'}) RETURN n.name AS name");
                result = await cursor.ToListAsync(record => record["name"].As<string>());
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult> addEmail(Mail mail)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"CREATE (n:Mail {name:'" + mail.name + "'}) return n");
                //result = await cursor.ToListAsync(record => record["name"].As<string>());
            }

            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (a:Person),(b:Mail) WHERE a.name = '" + mail.username
                    + "' AND b.name = '" + mail.name + "' CREATE (a)-[r:IMA_MAIL]->(b) RETURN r LIMIT 1");
                //result = await cursor.ToListAsync(record => record["name"].As<string>());
            }

            return Ok("Added Successfully!");
        }

        [HttpDelete]
        public async Task<ActionResult> deleteEmail(Mail mail)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:Person {name:'" + mail.username
                            + "'})-[r:IMA_MAIL]->(m:Mail {name:'" + mail.name + "'}) delete r,m");
                //result = await cursor.ToListAsync(record => record["name"].As<string>());
            }

            return Ok("Deleted Successfully!");
        }
    }
}