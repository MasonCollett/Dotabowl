using Dotabowl.Api.Models;
using Dotabowl.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Dotabowl.Api.Data
{
    // Add-Migration [name]
    // Update-Database

    public class DotabowlContext : DbContext
    {
        public DotabowlContext(DbContextOptions<DotabowlContext> options) : base(options) { }

        public DbSet<Player> Players { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<MatchParticipant> MatchParticipants { get; set; }
        public DbSet<Hero> Heroes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // MatchParticipant → Match (many participants per match)
            modelBuilder.Entity<MatchParticipant>()
                .HasOne<Match>()
                .WithMany(m => m.Participants)
                .HasForeignKey(mp => mp.MatchId)
                .OnDelete(DeleteBehavior.Cascade);

            // MatchParticipant → Player (many participants per player possible)
            modelBuilder.Entity<MatchParticipant>()
                .HasOne<Player>()
                .WithMany() 
                .HasForeignKey(mp => mp.PlayerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
