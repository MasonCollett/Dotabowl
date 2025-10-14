using Dotabowl.Api.Data;
using Dotabowl.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dotabowl.Controllers
{
    [Route("api/[controller]")] // URL: /api/players
    [ApiController]
    public class PlayersController : ControllerBase
    {
        private readonly DotabowlContext _context;

        public PlayersController(DotabowlContext context)
        {
            _context = context; // connect to the database
        }

        // GET: api/players
        [HttpGet]
        public async Task<IActionResult> GetPlayers()
        {
            var players = await _context.Players.OrderBy(p => p.Name).ToListAsync();
            return Ok(players);
        }

        // GET: api/player
        [HttpGet("{id}")]
        public ActionResult<Player> GetPlayer(int id)
        {
            var player = _context.Players.Find(id);

            if (player == null)
                return NotFound();

            return player;
        }

        // POST: api/players
        [HttpPost]
        public ActionResult<Player> AddPlayer([FromBody] Player player)
        {
            _context.Players.Add(player); // tell EF Core to add this player to Player table
            _context.SaveChanges();       // save it to the database

            // return a response with the newly created player
            return CreatedAtAction(nameof(GetPlayer), new { id = player.Id }, player);
        }
    }
}
