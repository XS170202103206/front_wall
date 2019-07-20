import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-new-msg',
  templateUrl: './new-msg.component.html',
  styleUrls: ['./new-msg.component.css']
})
export class NewMsgComponent implements OnInit {

  public showNewMsgWithAnimation: any = true;

  public newMsg: any = {
    Content_id: -1,
    Content: '',
    LikeCount: 0,
    NickName: '',
    Sex: 2,
    State: null,
    createtime: '',
    Count_P: 0
  };

  public sex: boolean = this.newMsg.Sex === 2 ? true : false;

  constructor(public router: Router, public http: HttpClient, private titleService: Title) {
    this.titleService.setTitle('发布');
  }

  ngOnInit() {
  }

  submit() {
    // dom操作获取数据
    // var nickname:any = document.getElementById('nickname');
    // console.log(nickname.value)
    const newMsg = this.newMsg;
    // 参数有效性校验
    if (newMsg.NickName.length === 0 || newMsg.Content.length === 0) {
      alert('昵称和内容都要填哦');
      return;
    }
    // 发布
    const that = this;
    const username = JSON.parse(localStorage.getItem('formUsername'));
    // tslint:disable-next-line: max-line-length
    const params = new HttpParams().set('formName', newMsg.NickName).set('formSex', newMsg.Sex).set('formContent', newMsg.Content).set('username', username);
    const url = '/blxb-newConfession/wallConfession/web/?r=content/publish';
    this.http.post(url, params).subscribe((response: any) => {
      if (response.error === 0) {
        const Params = new HttpParams().set('formName', newMsg.NickName).set('formSex', newMsg.Sex).set('username', username);
        that.http.post('/blxb-newConfession/wallConfession/web/?r=content/upuser', Params).subscribe((Response: any) => {
          if (Response.error === 0) {
            alert('发布成功~');
            that.close();
          }
        });
      }
    });
  }

  chooseSex(e) {
    // 男生为true 2女生为false 1
    const sex = e.target.id;
    // 下面是静态变化
    switch (sex) {
      case '1':
        this.sex = false;
        break;
      case '2':
        this.sex = true;
    }
    // 赋值
    this.newMsg.Sex = sex;
  }

  close() {
    this.router.navigate(['/home']);
  }
}
