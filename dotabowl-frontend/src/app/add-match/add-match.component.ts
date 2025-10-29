import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
  @ViewChild('matchForm') matchForm!: NgForm; 
  clicked = false;
  showToast = false;
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
  typeOptions = ['Ability Draft', 'ADAR', 'All Pick', 'All Random', 'Captains Draft', 'Random Draft', 'Single Draft', 'Turbo']

  players: any[] = [];
  radiantPlayerIds: number[] = [];
  direPlayerIds: number[] = [];

  constructor(private matchesService: MatchService, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('/api/players').subscribe({
      next: players => this.players = players,
      error: err => console.error('Failed to load players', err)
    });
  }


  addMatch(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched(); 
      return;
    }

    const participants = [
      ...this.radiantPlayerIds.map(id => ({ playerId: id, team: 'Radiant', isWinner: this.winner === 'Radiant' })),
      ...this.direPlayerIds.map(id => ({ playerId: id, team: 'Dire', isWinner: this.winner === 'Dire' }))
    ].filter((p, index, self) => index === self.findIndex(t => t.playerId === p.playerId));

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const localDateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newMatch: Match = {
      length: this.matchLength, // or calculate from minutes/seconds
      type: this.type,
      winner: this.winner,
      radiantKills: this.radiantKills ?? 0,
      direKills: this.direKills ?? 0,
      date: localDateStr,
      participants
    };

    this.matchesService.addMatch(newMatch);
    this.showSuccessPopup();

    form.resetForm();
    this.radiantPlayerIds = [];
    this.direPlayerIds = [];
  };


  onRadiantChange(event: any, playerId: number) {
    if (event.target.checked) {
      if (!this.radiantPlayerIds.includes(playerId) && this.radiantPlayerIds.length < 5) {
        this.radiantPlayerIds.push(playerId);
      }
    } else {
      this.radiantPlayerIds = this.radiantPlayerIds.filter(id => id !== playerId);
    }
  }


  showSuccessPopup() {
    this.showToast = true;

    // Hide automatically after 3 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
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
