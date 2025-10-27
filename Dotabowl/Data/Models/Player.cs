using System.ComponentModel.DataAnnotations.Schema;

namespace Dotabowl.Api.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string SteamName { get; set; }

        public int AllPickWins { get; set; } = 0;
        public int AllPickLosses { get; set; } = 0;
        public int AllPickGames { get; set; } = 0;

        public int TurboWins { get; set; } = 0;
        public int TurboLosses { get; set; } = 0;
        public int TurboGames { get; set; } = 0;

        public int CaptDraftWins { get; set; } = 0;
        public int CaptDraftLosses { get; set; } = 0;
        public int CaptDraftGames { get; set; } = 0;

        public int SingleDraftWins { get; set; } = 0;
        public int SingleDraftLosses { get; set; } = 0;
        public int SingleDraftGames { get; set; } = 0;

        public int RandomDraftWins { get; set; } = 0;
        public int RandomDraftLosses { get; set; } = 0;
        public int RandomDraftGames { get; set; } = 0;

        public int AllRandomWins { get; set; } = 0;
        public int AllRandomLosses { get; set; } = 0;
        public int AllRandomGames { get; set; } = 0;

        public int ADARWins { get; set; } = 0;
        public int ADARLosses { get; set; } = 0;
        public int ADARGames { get; set; } = 0;

        public int TotalGames { get; set; } = 0;
        public int TotalWins { get; set; } = 0;
        public int TotalLosses { get; set; } = 0;

        [Column(TypeName = "decimal(8,2)")] // 3 digits before decimal, 2 digits after 
        public decimal TotalGameTime { get; set; } = 0;

        [Column(TypeName = "decimal(5,2)")] // 3 digits before decimal, 2 digits after 
        public decimal WinRate { get; set; } = 0;

        public string? ProfilePictureUrl { get; set; }
    }
}
