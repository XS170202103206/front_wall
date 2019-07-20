import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public myHeight: string;
  public items: any[] = [
    {
      name: '表白墙',
      unselected: '../../../assets/images/wall.png',
      selected: '../../../assets/images/wall-selected.png',
      url: '/home/list'
    },
    {
      name: '历史',
      unselected: '../../../assets/images/history.png',
      selected: '../../../assets/images/history-selected.png',
      url: '/home/history'
    },
    {
      name: '收信箱',
      unselected: '../../../assets/images/messages.png',
      selected: '../../../assets/images/messages-selected.png',
      url: '/home/message'
    }
  ];
  public currentTab: any = 0;

  constructor(public router: Router, private titleService: Title) { 
    this.titleService.setTitle('主页');
  }

  ngOnInit() {
    // 沙雕占位盒
    this.myHeight = (105 + ((document.getElementById('img').offsetWidth) / 1.877)).toString() + 'px';
    console.log(this.myHeight);
    // 读缓存
    const lastTab = JSON.parse(localStorage.getItem('lastTab'));
    this.currentTab = lastTab;
    this.router.navigate([this.items[this.currentTab].url]);
  }

  tab(event) {
    // 静态切换
    this.currentTab = event.target.id;
    // console.log(this.currentTab)
    // 跳转
    this.router.navigate([this.items[this.currentTab].url]);
  }
}
