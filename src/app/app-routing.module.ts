import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/home/list/list.component';
import { HistoryComponent } from './components/home/history/history.component';
import { MessageComponent } from './components/home/message/message.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { NewMsgComponent } from './components/new-msg/new-msg.component';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent,
    children: [
      {path: 'list', component: ListComponent},
      {path: 'history', component: HistoryComponent},
      {path: 'message', component: MessageComponent},
      {path: '**', redirectTo: 'list'},
    ]
  },
  {path: 'welcome', component: WelcomeComponent},
  {path: 'newMsg', component: NewMsgComponent},
  // 匹配不到路由时加载的组件
  {path: '**', redirectTo: 'welcome'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
