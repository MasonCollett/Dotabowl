using Dotabowl.Api.Data;
using Dotabowl.Api.Models;
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

        private readonly Dictionary<string, Action<Player, bool>> _matchTypeActions = new()
        {
            ["All Pick"] = (player, isWinner) =>
            {
                player.AllPickGames += 1;
                if (isWinner) player.AllPickWins += 1;
                else player.AllPickLosses += 1;
            },
            ["Turbo"] = (player, isWinner) =>
            {
                player.TurboGames += 1;
                if (isWinner) player.TurboWins += 1;
                else player.TurboLosses += 1;
            },
            ["Captains Draft"] = (player, isWinner) =>
            {
                player.CaptDraftGames += 1;
                if (isWinner) player.CaptDraftWins += 1;
                else player.CaptDraftLosses += 1;
            },
            ["Single Draft"] = (player, isWinner) =>
            {
                player.SingleDraftGames += 1;
                if (isWinner) player.SingleDraftWins += 1;
                else player.SingleDraftLosses += 1;
            },
            ["Random Draft"] = (player, isWinner) =>
            {
                player.RandomDraftGames += 1;
                if (isWinner) player.RandomDraftWins += 1;
                else player.RandomDraftLosses += 1;
            },
            ["All Random"] = (player, isWinner) =>
            {
                player.AllRandomGames += 1;
                if (isWinner) player.AllRandomWins += 1;
                else player.AllRandomLosses += 1;
            },
            ["ADAR"] = (player, isWinner) =>
            {
                player.ADARGames += 1;
                if (isWinner) player.ADARWins += 1;
                else player.ADARLosses += 1;
            },
            ["Ability Draft"] = (player, isWinner) =>
            {
                player.ADGames += 1;
                if (isWinner) player.ADWins += 1;
                else player.ADLosses += 1;
            }
        };

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
                .OrderByDescending(m => m.Id)
                .ToList();
        }

        // POST: api/match
        [HttpPost]
        public ActionResult<Match> AddMatch([FromBody] Match match)
        {
            match.Participants ??= new List<MatchParticipant>();
            var matchTime = GetMatchTime(match);

            _context.Matches.Add(match);

            foreach (MatchParticipant participant in match.Participants)
            {
                var player = _context.Players.FirstOrDefault(p => p.Id == participant.PlayerId);
                if (player != null)
                {
                    player.TotalGames += 1;
                    if (participant.IsWinner) player.TotalWins += 1;
                    else player.TotalLosses += 1;

                    if (_matchTypeActions.TryGetValue(match.Type, out var updateAction))
                    {
                        updateAction(player, participant.IsWinner);
                    }

                    player.WinRate = player.TotalGames > 0 ? (decimal)player.TotalWins / player.TotalGames * 100 : 0;

                    player.TotalGameTime += matchTime;
                }
            }

            _context.SaveChanges();

            return CreatedAtAction(nameof(GetMatches), new { id = match.Id }, match);
        }

        private decimal GetMatchTime(Match match)
        {
            var stringTime = match.Length;
            if (string.IsNullOrWhiteSpace(stringTime)) return 0;

            var parts = stringTime.Split(':');
            if (parts.Length != 2) return 0;

            if (int.TryParse(parts[0], out int minutes) && int.TryParse(parts[1], out int seconds))
            {
                decimal totalMinutes = minutes + (seconds / 60m);
                return Math.Round(totalMinutes, 2);
            }
            return 0;
        }
    }
}
