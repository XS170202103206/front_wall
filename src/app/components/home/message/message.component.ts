import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  public data: any[];
  public array: any[];
  public username: any = JSON.parse(localStorage.getItem('formUsername'));

  constructor(public http: HttpClient, public router: Router) { }

  ngOnInit() {
    localStorage.setItem('lastTab', JSON.stringify(2));
    const that = this;
    // tslint:disable-next-line: radix
    const username = that.username;
    // const params = new HttpParams().set('first', '0').set('last', "100");
    const params = new HttpParams().set('username', that.username);
    const url = '/blxb-newConfession/wallConfession/web/?r=comment/letter';
    this.http.post(url, params).subscribe((response: any) => {
      if (response.error === 0) {
        // 很迷这个数据
        const data = response.data_sum[0];
        const temp = data[0].comment;
        let comment = [];
        // 自己给自己评论的不显示
        let index = 0;
        while (index !== temp.length) {
          if (temp[index].openid != username) {
            comment.push(temp[index]);
          }
          index ++;
        }
        console.log(data);
        // 分隔内容和用户信息
        const mid = (data.length - 1) / 2;
        // tslint:disable-next-line: forin
        for (const i in comment) {
          for (let j = 1; j < mid; j++) {
            if (comment[i].content_id === data[j].content[0].content_id) {
              comment[i].content = data[j].content[0].content;
              break;
            }
          }
          for (let j = mid + 1; j < data.length - 1; j++) {
            if (comment[i].openid === data[j].user[0].openid) {
              // comment[i].nickname = data[j].user[0].nickname;
              comment[i].sex = data[j].user[0].sex;
              break;
            }
          }
        }
        // 终于好了
        console.log(comment);
        // tslint:disable-next-line: no-unused-expression
        comment.reverse();
        // 隐藏加载动画
        const loading = document.getElementById('loading');
        loading.style.display = 'none';
        that.array = comment;
      }
    });
  }

  read(event, index) {
    console.log(event.target.id);
    if (confirm('确定标记为已读吗？(会从消息列表中移除)')) {
      const that = this;
      const params = new HttpParams().set('id', event.target.id);
      const url = '/blxb-newConfession/wallConfession/web/?r=comment/upstate';
      this.http.post(url, params).subscribe((response: any) => {
        if (response.error === 0) {
          // 前端显示
          that.array.splice(index, 1);
        }
      });
    }
  }

}
