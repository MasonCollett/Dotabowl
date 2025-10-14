import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlayerService, Player } from '../services/player-service/player-service';

@Component({
  selector: 'app-add-player',
  standalone: true,
  templateUrl: './add-player.html',
  styleUrl: './add-player.css',
  imports: [FormsModule],  
})
export class AddPlayerComponent {
  name = '';
  steamName = '';

  constructor(private playerService: PlayerService) {}

  addPlayer() {
    const newPlayer: Player = {
      name: this.name,
      steamName: this.steamName,
      wins: 0,
      losses: 0,
      games: 0,
      adWins: 0,
      adLosses: 0,
      adGames: 0,
      totalGames: 0,
      winRate: 0
    };

    this.playerService.addPlayer(newPlayer).subscribe({
      next: player => {
        console.log('Player added:', player);
        alert(`Added player: ${player.name} (ID: ${player.id})`);
        this.name = '';
        this.steamName = '';
      },
      error: err => console.error(err)
    });
  }
}
