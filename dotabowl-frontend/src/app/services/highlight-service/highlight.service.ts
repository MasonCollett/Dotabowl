import { Injectable } from '@angular/core';
import { Match } from '../match-service/match-service'; // adjust to your actual model paths
import { Player } from '../player-service/player-service'; // adjust to your actual model paths
import { MinutesToTimePipe } from '../../misc/minutes-to-time-pipe';

@Injectable({
  providedIn: 'root'
})
export class HighlightService {
  private minutesToTimePipe = new MinutesToTimePipe();

  getParticipationTrophy(players: Player[]) {
    if (!players || players.length === 0) return this.getDummy();
    let best = players.reduce((mostLosses, player) =>
      player.totalLosses > mostLosses.totalLosses ? player : mostLosses
    );
    if (!best.totalLosses || best.totalLosses === 0) {
      best = this.getDummy();
    }

  return best;
  }

  getMvp(players: Player[]) {
    if (!players || players.length === 0) return this.getDummy();
    let best = players.reduce((best, player) =>
      player.winRate > best.winRate ? player : best
    );
    if (!best.winRate || best.winRate === 0) {
      best = this.getDummy();
    }

  return best;
  }

  getDegen(players: Player[]) {
    if (!players || players.length === 0) return this.getDummy();
    let best = players.reduce((best, player) =>
      player.totalGameTime > best.totalGameTime ? player : best
    );
    if (!best.totalGameTime || best.totalGameTime === 0) {
      best = this.getDummy();
    }

  return best;
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
        adGames: 0,
        allPickWins: 0,
        captDraftWins: 0,
        randomDraftWins: 0,
    } as Player;
  }

  getRandKing(players: Player[]) {
    if (!players || players.length === 0) return this.getDummy();
    const validPlayers = players.filter(player => 
      (player.adarGames + player.allRandomGames + player.singleDraftGames) > 3
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
    if (!players || players.length === 0) return this.getDummy();
    const validPlayers = players.filter(player => 
      (player.allPickGames + player.captDraftGames + player.randomDraftGames) > 3
    );

    if (validPlayers.length === 0) return this.getDummy();

    return players.reduce((best, player) =>
      ((player.allPickWins + player.captDraftWins + player.randomDraftWins)/(player.allPickGames + player.captDraftGames + player.randomDraftGames)) > 
      ((best.allPickWins + best.captDraftWins + best.randomDraftWins)/(best.allPickGames + best.captDraftGames + best.randomDraftGames)) ? player : best
    );
  }

  getAdKing(players: Player[]){
    if (!players || players.length === 0) return this.getDummy();
    const validPlayers = players.filter(player => 
      (player.adGames) > 3
    );

    if (validPlayers.length === 0) return this.getDummy();

    return players.reduce((best, player) =>
      (player.adWins/player.adGames) > (best.adWins/best.adGames)  ? player : best
    );
  }

  getAdKingWinrate(player: Player){
    let winrate = ((player.adWins / player.adGames) * 100);
    return winrate === 100 ? "100" : winrate.toFixed(1);
  }

  getNormKingWinrate(player: Player){
    let winrate = (((player.allPickWins + player.captDraftWins + player.randomDraftWins)/(player.allPickGames + player.captDraftGames + player.randomDraftGames))*100);
    return winrate === 100 ? "100" : winrate.toFixed(1);
  }

  getRandKingWinrate(player: Player){
    let winrate = (((player.adarWins + player.allRandomWins + player.singleDraftWins) /
        (player.adarGames + player.allRandomGames + player.singleDraftGames))*100);
    return winrate === 100 ? "100" : winrate.toFixed(1);
  }

  getName(player: Player): string {
    if (player.steamName === 'Actual Waste of Time') {
      return `${player.steamName}™`;
    }
    return player.steamName;
  }

  getHighlights(players: Player[], matches: Match[]) {
    const loser = this.getParticipationTrophy(players);
    const mvp = this.getMvp(players);
    const degen = this.getDegen(players);
    const randKing = this.getRandKing(players);
    const normKing = this.getNormKing(players);
    const adKing = this.getAdKing(players);

    return [
      {
        title: 'One True God',
        profilePic: adKing.profilePictureUrl,
        subtitle: this.getName(adKing),
        image: 'assets/images/zeus_god.png',
        description: `Highest Ability Draft Winrate (${this.getAdKingWinrate(adKing)}%)`
      },
      {
        title: 'Can We Play Regular For Once?',
        profilePic: normKing.profilePictureUrl,
        subtitle: this.getName(normKing),
        image: 'assets/images/sven.png',
        description: `Highest "Regular" Dota Winrate (${this.getNormKingWinrate(normKing)}%)`
      },
      {
        title: 'Let Chaos Reign!',
        profilePic: randKing.profilePictureUrl,
        subtitle: this.getName(randKing),
        image: 'assets/images/knight.png',
        description: `Highest "Random" Dota Winrate (${this.getRandKingWinrate(randKing)}%)`
      },
      {
        title: 'Thanks For Coming',
        profilePic: loser.profilePictureUrl,
        subtitle: this.getName(loser),
        image: 'assets/images/heart.png',
        description: `Most Losses (${loser.totalLosses})`
      },
      {
        title: 'The Secret Ingredient',
        profilePic: mvp.profilePictureUrl,
        subtitle: this.getName(mvp),
        image: 'assets/images/ingredient.png',
        description: `Highest Overall Winrate (${mvp.winRate}%)`
      },
      {
        title: 'What Year Is It?',
        profilePic: degen.profilePictureUrl,
        subtitle: this.getName(degen),
        image: 'assets/images/timezone.png',
        description: `Most Game Time (${this.minutesToTimePipe.transform(degen.totalGameTime)})`
      }
    ];
  }
}
