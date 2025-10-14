using System.ComponentModel.DataAnnotations.Schema;

namespace Dotabowl.Api.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string SteamName { get; set; }

        public int Wins { get; set; } = 0;
        public int Losses { get; set; } = 0;
        public int Games { get; set; } = 0;

        public int AdWins { get; set; } = 0;
        public int AdLosses { get; set; } = 0;
        public int AdGames { get; set; } = 0;

        public int TotalGames { get; set; } = 0;

        [Column(TypeName = "decimal(5,2)")] // 3 digits before decimal, 2 digits after 
        public decimal WinRate { get; set; } = 0;
    }
}
