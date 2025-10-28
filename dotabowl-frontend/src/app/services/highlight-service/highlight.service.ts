import { Injectable } from '@angular/core';
import { Match } from '../match-service/match-service'; // adjust to your actual model paths
import { Player } from '../player-service/player-service'; // adjust to your actual model paths
import { MinutesToTimePipe } from '../../misc/minutes-to-time-pipe';

@Injectable({
  providedIn: 'root'
})
export class HighlightService {
  private minutesToTimePipe = new MinutesToTimePipe();

  getLongestGame(matches: Match[]) {
    return matches.reduce((longest, match) =>
      match.length > longest.length ? match : longest
    );
  }

  getParticipationTrophy(players: Player[]) {
    return players.reduce((mostLosses, player) =>
      player.totalLosses > mostLosses.totalLosses ? player : mostLosses
    );
  }

  getMvp(players: Player[]) {
    return players.reduce((best, player) =>
      player.winRate > best.winRate ? player : best
    );
  }

  getDegen(players: Player[]) {
    return players.reduce((best, player) =>
      player.totalGameTime > best.totalGameTime ? player : best
    );
  }

  getHighlights(players: Player[], matches: Match[]) {
    const longest = this.getLongestGame(matches);
    const loser = this.getParticipationTrophy(players);
    const mvp = this.getMvp(players);
    const degen = this.getDegen(players);

    return [
      // {
      //   title: 'Why Do My Eyes Hurt',
      //   subtitle: `${longest.length} minutes`,
      //   image: 'assets/images/clock.jpg',
      //   description: `Longest match (${longest.length})`
      // },
      {
        title: 'Participation Trophy',
        profilePic: loser.profilePictureUrl,
        subtitle: loser.steamName,
        image: 'assets/images/participation.webp',
        description: `Most losses (${loser.totalLosses}) - thanks for playing!`
      },
      {
        title: 'The Secret Ingredient',
        profilePic: mvp.profilePictureUrl,
        subtitle: mvp.steamName,
        image: 'assets/images/ingredient.png',
        description: `Highest winrate (${mvp.winRate}%)`
      },
      {
        title: 'Please Touch Grass',
        profilePic: degen.profilePictureUrl,
        subtitle: degen.steamName,
        image: 'assets/images/grass.png',
        description: `Most game time (${this.minutesToTimePipe.transform(degen.totalGameTime)})`
      }
    ];
  }
}
