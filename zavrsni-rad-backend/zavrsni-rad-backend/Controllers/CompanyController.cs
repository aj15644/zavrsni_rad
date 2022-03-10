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
    public class CompanyController : ControllerBase
    {
        private readonly ILogger<CompanyController> _logger;
        private readonly IDriver _driver;

        public CompanyController(ILogger<CompanyController> logger, IDriver driver)
        {
            _logger = logger;
            _driver = driver;
        }

        [HttpGet]
        public async Task<ActionResult> showAllCompanies()
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:Person {company:TRUE}) RETURN n.ime AS ime");
                result = await cursor.ToListAsync(record => record["ime"].As<string>());
            }

            return Ok(result);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult> showMyCompany(string username)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:Person {name:'" + username
                                 + "'})-[:RADI_U]->(a:Person) RETURN a.ime AS ime");
                result = await cursor.ToListAsync(record => record["ime"].As<string>());
            }

            return Ok(result);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<ActionResult> submitRegister(Company company)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (n:Person) where n.name='" + company.name + "' RETURN n.name AS name");
                result = await cursor.ToListAsync(record => record["name"].As<string>());
            }

            if (result.Count == 0)
            {
                using (var session = _driver.AsyncSession())
                {
                    cursor = await session.RunAsync(@"CREATE (n:Person {ime:'" + company.ime
                        + "', ime_prezime:'" + company.ime_prezime + "', name:'" + company.name
                        + "', password:'" + company.password + "', date_of_establishment:'" + company.date_of_establishment
                        + "', location:'" + company.location + "', picture:'default.png', company: true}) RETURN n");
                }

                return Ok("Added Successfully!");
            }
            else
            {
                return Ok("This username is occupied! Try another.");
            }
        }

        [HttpPost]
        public async Task<ActionResult> addRadiU(Company company)
        {
            IResultCursor cursor;
            var result = new List<string>();
            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (a:Person {name:'" + company.personUsername
                        + "'})-[r:RADI_U]->() DELETE r");
            }

            using (var session = _driver.AsyncSession())
            {
                cursor = await session.RunAsync(@"MATCH (a:Person {name:'" + company.personUsername
                    + "'}),(b:Person {ime:'" + company.ime + "'}) MERGE (a)-[r:RADI_U {date_of:'" + company.date_of
                    + "'}]->(b) RETURN r LIMIT 1");
            }

            return Ok("Added Successfully!");
        }
    }
}