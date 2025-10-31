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
  displayedColumns: string[] = [
    'profilePicture', 
    'name', 
    'totalWins',
    'totalLosses',
    'totalGames',
    'winRate', 
    'totalGameTime',
    'adWins',
    'adLosses',
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
    'turboWins',
    'turboLosses',
  ];

  dataSource = new MatTableDataSource<Player>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private playerService: PlayerService) {}
  sortColumn: keyof Player | null = null;
  sortDirection: 'asc' | 'desc' = 'desc';
  columns: { key: keyof Player; label: string; sortable: boolean }[] = [
    { key: 'profilePictureUrl', label: '', sortable: false },
    { key: 'name', label: 'Player Name', sortable: true },
    { key: 'totalWins', label: 'Total Wins', sortable: true },
    { key: 'totalLosses', label: 'Total Losses', sortable: true },
    { key: 'totalGames', label: 'Total Games', sortable: true },
    { key: 'winRate', label: 'Win Rate', sortable: true },
    { key: 'totalGameTime', label: 'Total Game Time', sortable: true },
    { key: 'adWins', label: 'Ability Draft Wins', sortable: true },
    { key: 'adLosses', label: 'Ability Draft Losses', sortable: true },
    { key: 'singleDraftWins', label: 'Single Draft Wins', sortable: true },
    { key: 'singleDraftLosses', label: 'Single Draft Losses', sortable: true },
    { key: 'captDraftWins', label: 'Capt Draft Wins', sortable: true },
    { key: 'captDraftLosses', label: 'Capt Draft Losses', sortable: true },
    { key: 'randomDraftWins', label: 'Random Draft Wins', sortable: true },
    { key: 'randomDraftLosses', label: 'Random Draft Losses', sortable: true },
    { key: 'adarWins', label: 'ADAR Wins', sortable: true },
    { key: 'adarLosses', label: 'ADAR Losses', sortable: true },
    { key: 'allPickWins', label: 'All Pick Wins', sortable: true },
    { key: 'allPickLosses', label: 'All Pick Losses', sortable: true },
    { key: 'turboWins', label: 'Turbo Wins', sortable: true },
    { key: 'turboLosses', label: 'Turbo Losses', sortable: true },
  ];


  ngOnInit(): void {
    this.playerService.getPlayers().subscribe(players => {
      players.sort((a, b) => b.winRate - a.winRate);
      this.dataSource.data = players;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.sort.active = 'totalWins';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit();
  }

  sortData(column: keyof Player) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }

    this.dataSource.data.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      const multiplier = this.sortDirection === 'asc' ? 1 : -1;
      return (valueA > valueB ? 1 : -1) * multiplier;
    });
  }

  getWinRateColor(winRate: number): string {
    const rate = Math.max(0, Math.min(100, winRate));

    // Define RGB for the three key points
    const redStart = { r: 221, g: 119, b: 110 };     // 0%
    const yellowMid = { r: 245, g: 206, b: 98 };   // 50%
    const greenEnd = { r: 87, g: 187, b: 138 };     // 100%

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


