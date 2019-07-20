import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  public welcomeHideWithAnimation: any = false;
  // public flag:boolean = this.router.url != '/welcome' ? true : false
  public user: any = {
    formUsername: '',
    formPassword: ''
  };
  public isFirstIn: any = JSON.parse(localStorage.getItem('formUsername')) == null ? true : false;


  constructor(public router: Router, public http: HttpClient, private titleService: Title) {
    this.titleService.setTitle('表白墙');
  }

  ngOnInit() {}

  start() {
    if (this.isFirstIn === true) {
      const user = this.user;
      // 判空
      if (user.formUsername.length === 0 || user.formPassword.length === 0) {
        alert('用户名和密码都要填哦');
        return;
      }
      if (user.formUsername.length < 6 || user.formPassword.length < 6) {
        alert('用户名和密码最少都要6位哦');
        return;
      }
      // 登陆
      const that = this;
      const params = new HttpParams().set('formUsername', user.formUsername).set('formPassword', user.formPassword);
      const url  = '/blxb-newConfession/wallConfession/web/?r=login/publish';
      this.http.post(url, params).subscribe((response: any) => {
        // 成功
        if (response.error === 0) {
          this.router.navigate(['/home']);
          // 缓存
          localStorage.setItem('formUsername', JSON.stringify(user.formUsername));
          localStorage.setItem('formPassword', JSON.stringify(user.formPassword));
        } else {
          alert('用户名已经存在');
          return;
        }
      });
    } else {
      this.router.navigate(['/home']);
    }
  }

  forgetPassword() {
    alert('发送:找回密码+用户名到北理小报公众号，后台人员会帮助你找回密码哦');
  }
}
