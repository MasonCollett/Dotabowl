using Dotabowl.Api.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dotabowl.Data.Models
{
    public class Match
    {
        public int Id { get; set; }

        public string Length { get; set; }

        public string Type { get; set; }

        public string Winner { get; set; }
        public int RadiantKills { get; set; }
        public int DireKills { get; set; }
        public DateTime Date { get; set; }

        public ICollection<MatchParticipant> Participants { get; set; } = new List<MatchParticipant>();
    }
}
