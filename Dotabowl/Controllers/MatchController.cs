using Dotabowl.Api.Data;
using Dotabowl.Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dotabowl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchController : ControllerBase
    {
        private readonly DotabowlContext _context;

        public MatchController(DotabowlContext context)
        {
            _context = context;
        }

        // GET: api/match
        [HttpGet]
        public IEnumerable<object> GetMatches()
        {
            return _context.Matches
                .Include(m => m.Participants)
                .Select(m => new
                {
                    m.Id,
                    m.Length,
                    m.Type,
                    m.Winner,
                    m.RadiantKills,
                    m.DireKills,
                    m.Date,
                    Participants = m.Participants.Select(mp => new
                    {
                        mp.Id,
                        mp.MatchId,
                        mp.PlayerId,
                        mp.Team,
                        mp.IsWinner,
                        PlayerName = _context.Players.FirstOrDefault(p => p.Id == mp.PlayerId).Name
                    })
                })
                .OrderByDescending(m => m.Date)
                .ToList();
        }

        // POST: api/match
        [HttpPost]
        public ActionResult<Match> AddMatch([FromBody] Match match)
        {
            match.Participants ??= new List<MatchParticipant>();

            _context.Matches.Add(match);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetMatches), new { id = match.Id }, match);
        }
    }
}
