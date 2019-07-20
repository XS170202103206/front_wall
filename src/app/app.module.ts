import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from "@angular/common"


//引入http模块HttpClientModule
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { NewMsgComponent } from './components/new-msg/new-msg.component';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/home/list/list.component';
import { HistoryComponent } from './components/home/history/history.component';
import { MessageComponent } from './components/home/message/message.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    WelcomeComponent,
    NewMsgComponent,
    HomeComponent,
    HistoryComponent,
    MessageComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
