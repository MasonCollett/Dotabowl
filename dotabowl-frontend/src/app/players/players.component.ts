import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Player, PlayerService } from '../services/player-service/player-service';
import { MinutesToTimePipe } from '../misc/minutes-to-time-pipe';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MinutesToTimePipe
  ],
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  displayedColumns: string[] = ['profilePicture', 
    'name', 
    'totalWins',
    'totalLosses',
    'totalGames',
    'winRate', 
    'totalGameTime',
    'turboWins',
    'turboLosses',
    'singleDraftWins',
    'singleDraftLosses',
    'adarWins',
    'adarLosses',
    'allPickWins',
    'allPickLosses',
    'captDraftWins',
    'captDraftLosses',
    'randomDraftWins',
    'randomDraftLosses',
  ];

  dataSource = new MatTableDataSource<Player>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe(players => {
      this.dataSource.data = players;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.sort.active = 'totalWins';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit();
  }

  getWinRateColor(winRate: number): string {
    const rate = Math.max(0, Math.min(100, winRate));

    // Define RGB for the three key points
    const redStart = { r: 248, g: 215, b: 218 };   // 0%
    const yellowMid = { r: 255, g: 243, b: 205 };  // 50%
    const greenEnd = { r: 212, g: 237, b: 218 };   // 100%

    let r, g, b;

    if (rate <= 50) {
      // interpolate red → yellow
      const t = rate / 50;
      r = Math.round(redStart.r + (yellowMid.r - redStart.r) * t);
      g = Math.round(redStart.g + (yellowMid.g - redStart.g) * t);
      b = Math.round(redStart.b + (yellowMid.b - redStart.b) * t);
    } else {
      // interpolate yellow → green
      const t = (rate - 50) / 50;
      r = Math.round(yellowMid.r + (greenEnd.r - yellowMid.r) * t);
      g = Math.round(yellowMid.g + (greenEnd.g - yellowMid.g) * t);
      b = Math.round(yellowMid.b + (greenEnd.b - yellowMid.b) * t);
    }

    return `rgb(${r}, ${g}, ${b})`;
  }


}


