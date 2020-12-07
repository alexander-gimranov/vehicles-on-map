import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { interval } from 'rxjs/internal/observable/interval';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserInfo } from 'src/models/UserInfo';
import { AppService } from '../app.service';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  animations: [
    trigger('collapse', [
      state('true', style({ height: '95vh' })),
      state('false', style({ height: AUTO_STYLE })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ]),
    trigger('collapse-map', [
      state('true', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('false', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})

export class UsersListComponent implements OnInit, OnDestroy {
  public users: UserInfo[]
  public selected: number;

  public userImg = "src/assets/images/person-icon.png"; 

  public showMap: boolean = false;

  private updateSubscription: Subscription;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.getList();
    this.updateSubscription = interval(60000).subscribe(
      (val) => { 
        console.log('reload ' + new Date());
        this.getList();
      });    
  }

  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
  }

  selectUser(userId: number) {
    this.selected = userId;
  }

  private getList() {
    this.appService.getList().subscribe(list => this.users = list.data);
  }
}
