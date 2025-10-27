import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// TODO: Import all columns

export interface Player {
  name: string;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  totalGameTime: number;
  profilePictureUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private apiUrl = '/api/players';

  constructor(private http: HttpClient) { }

  addPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, player);
  }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }
}

