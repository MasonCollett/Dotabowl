using Dotabowl.Api.Models;
using Dotabowl.Data.Models;

public class MatchParticipant
{
    public int Id { get; set; }

    public int MatchId { get; set; }

    public int PlayerId { get; set; }

    public string Team { get; set; }
    public bool IsWinner { get; set; }
}