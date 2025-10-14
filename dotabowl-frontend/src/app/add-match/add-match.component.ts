import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchService, Match } from '../services/match-service/match-service';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-match',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,    
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule],
  templateUrl: './add-match.component.html',
  styleUrl: './add-match.component.css',
})
export class AddMatchComponent {
  type = '';
  winner = '';
  date = '';
  length = '';
  radiantKills: number | null = null;
  direKills: number | null = null;
  minutes: number | null = null;
  seconds: number | null = null;

  get matchLength(): string {
    const mm = (this.minutes ?? 0).toString().padStart(2, '0');
    const ss = (this.seconds ?? 0).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }

  winnerOptions = ['Radiant', 'Dire'];
  typeOptions = ['Ability Draft', 'All Pick', 'Captains Draft', 'Single Draft', 'Turbo']

  players: any[] = [];
  radiantPlayerIds: number[] = [];
  direPlayerIds: number[] = [];

  constructor(private matchservice: MatchService, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('/api/players').subscribe({
      next: players => this.players = players,
      error: err => console.error('Failed to load players', err)
    });
  }



  addMatch() {
    const radiantIds = [...this.radiantPlayerIds];
    const direIds = [...this.direPlayerIds];    

    let participants = [
      ...this.radiantPlayerIds.map(id => ({ playerId: id, team: 'Radiant', isWinner: this.winner === 'Radiant' })),
      ...this.direPlayerIds.map(id => ({ playerId: id, team: 'Dire', isWinner: this.winner === 'Dire' }))
    ];
    
    participants = participants.filter(
      (p, index, self) => index === self.findIndex((t) => t.playerId === p.playerId)
    );

    const newMatch: Match = {
      length: this.matchLength,
      type: this.type,
      winner: this.winner,
      radiantKills: this.radiantKills ?? 0,

      direKills: this.direKills ?? 0,
      date: new Date().toISOString(),
      participants
    };

    this.matchservice.addMatch(newMatch);
    this.length = '';
    this.radiantKills = null;
    this.direKills = null;
    this.type = '';
    this.winner = '';
    this.date = '';
    this.radiantPlayerIds = [];
    this.direPlayerIds = [];
  }

  onRadiantChange(event: any, playerId: number) {
    if (event.target.checked) {
      if (!this.radiantPlayerIds.includes(playerId) && this.radiantPlayerIds.length < 5) {
        this.radiantPlayerIds.push(playerId);
      }
    } else {
      this.radiantPlayerIds = this.radiantPlayerIds.filter(id => id !== playerId);
    }
  }

  onDireChange(event: any, playerId: number) {
    if (event.target.checked) {
      if (!this.direPlayerIds.includes(playerId) && this.direPlayerIds.length < 5) {
        this.direPlayerIds.push(playerId);
      }
    } else {
      this.direPlayerIds = this.direPlayerIds.filter(id => id !== playerId);
    }
  }

}
