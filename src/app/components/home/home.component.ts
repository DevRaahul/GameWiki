import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models/game';
import { GameService } from '../../sevices/game.service';
import { APIResponse } from '../../models/game';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public sort: string;
  public games: Array<Game>;
  private routeSub: Subscription;
  private gameSub: Subscription;
  public loading: boolean = false;

  constructor(
    private gameService: GameService,
    private activateRoute: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activateRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGame('metacrit', params['game-search']);
      } else {
        this.searchGame('metacrit');
      }
    });
  }
  searchGame(sort: string, search?: string) {
    this.loading = true;
    this.gameSub = this.gameService
      .getGameList(sort, search)
      .subscribe((res: APIResponse<Game>) => {
        this.loading = false;
        this.games = res.results;
        console.log(res);
      });
  }

  openDetails = (data: Game) => {
    console.log(data);
    this.route.navigate(['details', data.id]);
  };

  ngOnDestroy(): void {
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
