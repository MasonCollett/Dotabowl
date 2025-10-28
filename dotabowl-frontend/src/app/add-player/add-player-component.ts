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

//   addPlayer() {
//     const newPlayer: Player = {
//       name: this.name,
//       totalLosses: 0,
//       totalWins: 0,
//       winRate: 0,
//       totalGameTime: 0,
//       profilePictureUrl: "empty",
//     };

//     this.playerService.addPlayer(newPlayer).subscribe({
//       next: player => {
//         console.log('Player added:', player);
//         alert(`Added player: ${player.name}`);
//         this.name = '';
//         this.steamName = '';
//       },
//       error: err => console.error(err)
//     });
//   }
 }
