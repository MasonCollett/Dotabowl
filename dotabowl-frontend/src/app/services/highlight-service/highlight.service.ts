import { Injectable } from '@angular/core';
import { Match } from '../match-service/match-service';
import { Player } from '../player-service/player-service';
import { MinutesToTimePipe } from '../../misc/minutes-to-time-pipe';

@Injectable({
  providedIn: 'root'
})
export class HighlightService {
  private minutesToTimePipe = new MinutesToTimePipe();

  public getDummy(): Player {
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
      adGames: 0,
      allPickWins: 0,
      captDraftWins: 0,
      randomDraftWins: 0,
      totalGameTime: 0,
      winRate: 0
    } as Player;
  }

  private getTopPlayers(
    players: Player[],
    scoreFn: (p: Player) => number,
    filterFn?: (p: Player) => boolean
  ): Player[] {
    if (!players || players.length === 0) return [this.getDummy()];

    const validPlayers = filterFn ? players.filter(filterFn) : players;
    if (validPlayers.length === 0) return [this.getDummy()];

    let topPlayers: Player[] = [];
    let topScore = -Infinity;

    for (const player of validPlayers) {
      const score = scoreFn(player) || 0;
      if (score > topScore) {
        topScore = score;
        topPlayers = [player];
      } else if (score === topScore && score > 0) {
        topPlayers.push(player);
      }
    }

    // If there’s a tie or no top player, return a single dummy player
    if (topPlayers.length !== 1) return [this.getDummy()];

    return topPlayers;
  }

  getRandKings(players: Player[]): Player[] {
    return this.getTopPlayers(
      players,
      p => (p.adarWins + p.allRandomWins + p.singleDraftWins) /
           (p.adarGames + p.allRandomGames + p.singleDraftGames),
      p => (p.adarGames + p.allRandomGames + p.singleDraftGames) > 3
    );
  }

  getAdKings(players: Player[]): Player[] {
    return this.getTopPlayers(
      players,
      p => p.adWins / p.adGames,
      p => p.adGames > 3
    );
  }

  getNormKings(players: Player[]): Player[] {
    return this.getTopPlayers(
      players,
      p => (p.allPickWins + p.captDraftWins + p.randomDraftWins) /
           (p.allPickGames + p.captDraftGames + p.randomDraftGames),
      p => (p.allPickGames + p.captDraftGames + p.randomDraftGames) > 3
    );
  }

  getParticipationTrophy(players: Player[]): Player[] {
    return this.getTopPlayers(players, p => p.totalLosses || 0);
  }

  getMvps(players: Player[]): Player[] {
    return this.getTopPlayers(players, p => p.winRate || 0);
  }

  getDegens(players: Player[]): Player[] {
    return this.getTopPlayers(players, p => p.totalGameTime || 0);
  }

  getAdKingWinrates(players: Player[]): string {
    const player = players[0];
    const winrate = ((player.adWins / player.adGames) * 100);
    return winrate === 100 ? '100' : winrate.toFixed(1);
  }

  getNormKingWinrates(players: Player[]): string {
    const player = players[0];
    const winrate = ((player.allPickWins + player.captDraftWins + player.randomDraftWins) /
                     (player.allPickGames + player.captDraftGames + player.randomDraftGames) * 100);
    return winrate === 100 ? '100' : winrate.toFixed(1);
  }

  getRandKingWinrates(players: Player[]): string {
    const player = players[0];
    const winrate = ((player.adarWins + player.allRandomWins + player.singleDraftWins) /
                     (player.adarGames + player.allRandomGames + player.singleDraftGames) * 100);
    return winrate === 100 ? '100' : winrate.toFixed(1);
  }

  getName(players: Player[]): string {
    const player = players[0];
    return player.steamName === 'Actual Waste of Time' ? `${player.steamName}™` : player.steamName;
  }

  getHighlights(players: Player[]) {
    const losers = this.getParticipationTrophy(players);
    const mvps = this.getMvps(players);
    const degens = this.getDegens(players);
    const randKings = this.getRandKings(players);
    const normKings = this.getNormKings(players);
    const adKings = this.getAdKings(players);

    return [
      {
        title: 'One True God',
        profilePic: adKings[0].profilePictureUrl,
        subtitle: this.getName(adKings),
        image: 'assets/images/zeus_god.png',
        description: adKings[0].steamName === 'No Player Yet'
          ? "Highest Ability Draft Winrate - It's a Tie!"
          : `Highest Ability Draft Winrate (${this.getAdKingWinrates(adKings)}%)`
      },
      {
        title: 'Can We Play Regular For Once?',
        profilePic: normKings[0].profilePictureUrl,
        subtitle: this.getName(normKings),
        image: 'assets/images/sven.png',
        description: normKings[0].steamName === 'No Player Yet'
          ? `Highest "Regular" Dota Winrate - It's a Tie!`
          : `Highest "Regular" Dota Winrate (${this.getNormKingWinrates(normKings)}%)`,
        subDescription: "All Pick, Captains Draft, Random Draft"
      },
      {
        title: 'Let Chaos Reign!',
        profilePic: randKings[0].profilePictureUrl,
        subtitle: this.getName(randKings),
        image: 'assets/images/knight.png',
        description: randKings[0].steamName === 'No Player Yet'
          ? `Highest "Random" Dota Winrate - It's a Tie!`
          : `Highest "Random" Dota Winrate (${this.getRandKingWinrates(randKings)}%)`,
        subDescription: "ADAR, All Random, Single Draft"
      },
      {
        title: 'Thanks For Coming',
        profilePic: losers[0].profilePictureUrl,
        subtitle: this.getName(losers),
        image: 'assets/images/heart.png',
        description: losers[0].steamName === 'No Player Yet'
          ? "Most Losses - It's a Tie!"
          : `Most Losses (${losers[0].totalLosses})`
      },
      {
        title: 'The Secret Ingredient',
        profilePic: mvps[0].profilePictureUrl,
        subtitle: this.getName(mvps),
        image: 'assets/images/ingredient.png',
        description: mvps[0].steamName === 'No Player Yet'
          ? "Highest Overall Winrate - It's a Tie!"
          : `Highest Overall Winrate (${mvps[0].winRate}%)`
      },
      {
        title: 'What Year Is It?',
        profilePic: degens[0].profilePictureUrl,
        subtitle: this.getName(degens),
        image: 'assets/images/timezone.png',
        description: degens[0].steamName === 'No Player Yet'
          ? "Most Game Time - It's a Tie!"
          : `Most Game Time (${this.minutesToTimePipe.transform(degens[0].totalGameTime)})`
      }
    ];
  }
}
