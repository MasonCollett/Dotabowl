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

  getDummy(){
    return {
        steamName: 'No Player Yet',
        profilePictureUrl: 'assets/images/dummy.png',
        adarWins: 0,
        allRandomWins: 0,
        singleDraftWins: 0,
        adarGames: 0,
        allRandomGames: 0,
        singleDraftGames: 0,
        totalWins: 0,
        totalLosses: 0,
        adWins: 0,
    } as Player;
  }

  getRandKing(players: Player[]) {
    const validPlayers = players.filter(player => 
      (player.adarGames + player.allRandomGames + player.singleDraftGames) > 0
    );

    if (validPlayers.length === 0) return this.getDummy();

    return validPlayers.reduce((best, player) => {
      const playerWinrate = 
        (player.adarWins + player.allRandomWins + player.singleDraftWins) /
        (player.adarGames + player.allRandomGames + player.singleDraftGames);

      const bestWinrate = 
        (best.adarWins + best.allRandomWins + best.singleDraftWins) /
        (best.adarGames + best.allRandomGames + best.singleDraftGames);

      return playerWinrate > bestWinrate ? player : best;
    });
  }

  getNormKing(players: Player[]) {
    const validPlayers = players.filter(player => 
      (player.allPickGames + player.captDraftGames + player.randomDraftGames) > 0
    );

    if (validPlayers.length === 0) return this.getDummy();

    return players.reduce((best, player) =>
      (player.allPickWins + player.captDraftGames + player.randomDraftWins) > 
      (best.allPickWins + best.captDraftGames + best.randomDraftWins) ? player : best
    );
  }

  getAdKing(players: Player[]){
    const validPlayers = players.filter(player => 
      (player.adGames) > 0
    );

    if (validPlayers.length === 0) return this.getDummy();

    return players.reduce((best, player) =>
      player.adWins > best.adWins  ? player : best
    );
  }

  getAdKingWins(player: Player){
    return player.adWins;
  }

  getNormKingWins(player: Player){
    return (player.allPickWins + player.captDraftGames + player.randomDraftWins);
  }

  getRandKingWins(player: Player){
    return (player.adarWins + player.allRandomWins + player.singleDraftWins);
  }

  getHighlights(players: Player[], matches: Match[]) {
    const longest = this.getLongestGame(matches);
    const loser = this.getParticipationTrophy(players);
    const mvp = this.getMvp(players);
    const degen = this.getDegen(players);
    const randKing = this.getRandKing(players);
    const normKing = this.getNormKing(players);
    const adKing = this.getAdKing(players);

    return [
      // {
      //   title: 'Why Do My Eyes Hurt',
      //   subtitle: `${longest.length} minutes`,
      //   image: 'assets/images/clock.jpg',
      //   description: `Longest match (${longest.length})`
      // },
      {
        title: 'One True God',
        profilePic: adKing.profilePictureUrl,
        subtitle: adKing.steamName,
        image: 'assets/images/zeus_god.png',
        description: `Most Ability Draft Wins (${this.getAdKingWins(adKing)})`
      },
      {
        title: 'Can We Play Regular For Once?',
        profilePic: normKing.profilePictureUrl,
        subtitle: normKing.steamName,
        image: 'assets/images/tango.png',
        description: `Most "Regular" Dota Wins (${this.getNormKingWins(normKing)})`
      },
      {
        title: 'Lord of the Chaos',
        profilePic: randKing.profilePictureUrl,
        subtitle: randKing.steamName,
        image: 'assets/images/goofy.png',
        description: `Most "Random" Dota Wins (${this.getRandKingWins(randKing)})`
      },
      {
        title: 'Participation Trophy',
        profilePic: loser.profilePictureUrl,
        subtitle: loser.steamName,
        image: 'assets/images/participation.webp',
        description: `Most Losses (${loser.totalLosses})`
      },
      {
        title: 'The Secret Ingredient',
        profilePic: mvp.profilePictureUrl,
        subtitle: mvp.steamName,
        image: 'assets/images/ingredient.png',
        description: `Highest Overall Winrate (${mvp.winRate}%)`
      },
      {
        title: 'Please Touch Grass',
        profilePic: degen.profilePictureUrl,
        subtitle: degen.steamName,
        image: 'assets/images/grass.png',
        description: `Most Game Time (${this.minutesToTimePipe.transform(degen.totalGameTime)})`
      }
    ];
  }
}
