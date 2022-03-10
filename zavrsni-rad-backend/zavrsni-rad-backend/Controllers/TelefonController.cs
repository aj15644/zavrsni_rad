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
    public class TelefonController : ControllerBase
    {
        private readonly ILogger<TelefonController> _logger;
        private readonly IDriver _driver;

        public TelefonController(ILogger<TelefonController> logger, IDriver driver)
        {
            _logger = logger;
            _driver = driver;
        }

        [HttpGet("{username}")]
        public async Task<ActionResult> showMyPhone(string username)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:Telefon)<-[r:IMA_BROJ]-(p:Person {name:'" + username
                    + "'}) RETURN n.name AS name");
                result = await cursor.ToListAsync(record => record["name"].As<string>());
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult> addPhone(Telefon telefon)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"CREATE (n:Telefon {name:'" + telefon.name + "'}) return n");
                //result = await cursor.ToListAsync(record => record["name"].As<string>());
            }

            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (a:Person),(b:Telefon) WHERE a.name = '" + telefon.username
                    + "' AND b.name = '" + telefon.name + "' CREATE (a)-[r:IMA_BROJ]->(b) RETURN r LIMIT 1");
                //result = await cursor.ToListAsync(record => record["name"].As<string>());
            }

            return Ok("Added Successfully!");
        }

        [HttpDelete]
        public async Task<ActionResult> deletePhone(Telefon telefon)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:Person {name:'" + telefon.username
                    + "'})-[r:IMA_BROJ]->(t:Telefon {name:'" + telefon.name + "'}) delete r,t");
                //result = await cursor.ToListAsync(record => record["name"].As<string>());
            }

            return Ok("Deleted Successfully!");
        }
    }
}