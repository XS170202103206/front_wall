import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';

@HostListener('scroll', ['$event'])


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  public isAll = false;
  public list: any[];
  public showComment: any = false;
  public myHeight: any;
  public commentInput: any = '';
  public currentId: any = -1;
  public likeFlagArr: Array<boolean>;
  public currentIndex: any;
  public first: any = 0;
  public last: any = 10;
  public username = JSON.parse(localStorage.getItem('formUsername'));

  constructor(public http: HttpClient, public router: Router) {
  }

  ngOnInit() {
    // 来了老弟
    localStorage.setItem('lastTab', JSON.stringify(0));
    this.loadMore(this.first, this.last);
  }

  loadMore(first, last) {
    if (this.isAll) {
      return;
    }
    const that = this;
    const getConentParams = new HttpParams().set('first', first).set('last', last);
    const getLikeParams = new HttpParams().set('username', this.username);
    const getConentUrl = '/blxb-newConfession/wallConfession/web/?r=content/get';
    const getLikeUrl = '/blxb-newConfession/wallConfession/web/?r=content/showlike';
    // 主页数据
    this.http.post(getConentUrl, getConentParams).subscribe((response: any) => {
      if (response.error === 0) {
        const list = response.data;
        if (list.length == 0) {
          console.log('0');
          that.isAll = true;
          return;
        }
        // 标记数组
        // 点赞过的contentid数组
        that.http.post(getLikeUrl, getLikeParams).subscribe((Response: any) => {
          if (response.error === 0) {
            const data = Response.data;
            console.log(data);
            // 标记数组
            // tslint:disable-next-line: radix
            const array: boolean[] = new Array(Number.parseInt(list[0].content_id));
            // tslint:disable-next-line: forin
            for (const i in data) {
              array[data[i].content_id] = true;
            }
            that.likeFlagArr = array;
            console.log(that.likeFlagArr);
          }
        });
        // 隐藏加载动画
        const loading = document.getElementById('loading');
        loading.style.display = 'none';
        if (first == 0) {
          that.list = list;
        } else {
        // tslint:disable-next-line: forin
          for (const i in list) {
            that.list.push(list[i]);
          }
        }
        console.log(list);
      }
    });

  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit() {
    const that = this;
    // tslint:disable-next-line: only-arrow-functions
    window.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.body.scrollHeight;
      const screenHeight = window.screen.height;
      const limit = (scrollTop + screenHeight) / scrollHeight;
      if (limit >= 0.999) {
        that.first += 10;
        that.last += 10;
        that.loadMore(that.first, that.last);
      }
    };
  }

  like(event, idx) {
    const id = event.target.id;
    if (this.likeFlagArr[id]) {
      alert('你已经点过赞了~');
      return;
    }
    // 前端显示
    this.likeFlagArr[id] = true;
    // tslint:disable-next-line: radix
    this.list[idx].likecount = parseInt(this.list[idx].likecount) + 1;
    // 点赞
    const that = this;
    const params = new HttpParams().set('formid', id).set('dzSum', this.list[idx].likecount).set('username', this.username);
    const url = '/blxb-newConfession/wallConfession/web/?r=content/likerender';
    this.http.post(url, params).subscribe((response: any) => {
      if (response.error === 0) {
        console.log(response);
      }
      console.log(response);
    });
  }


  newMsg() {
    const that = this;
    that.router.navigate(['/newMsg']);

    // this.listHideWithAnimation = true;
    // setTimeout(() => {
    // }, 800);
  }

  comment(event, idx) {
    this.showComment = true;
    this.myHeight = (document.documentElement.clientHeight - 40).toString() + 'px';
    this.currentId = event.target.id;
    this.commentInput = JSON.parse(localStorage.getItem('commentInput'));
    this.currentIndex = idx;
  }

  cancelComment() {
    const commentInput = this.commentInput;
    // 存为缓存
    localStorage.setItem('commentInput', JSON.stringify(this.commentInput));
    this.currentId = -1;
    this.showComment = false;
  }

  send() {
    const comment = this.commentInput;
    if (comment.length === 0) {
      return;
    } else {
      // 开始发表
      const that = this;
      // tslint:disable-next-line: max-line-length
      const params = new HttpParams().set('id', this.currentId).set('content', comment).set('username', this.username);
      // const params = new HttpParams().set('id', '1');
      const url = '/blxb-newConfession/wallConfession/web/?r=comment/publish';
      this.http.post(url, params).subscribe((response: any) => {
        if (response.error === 0) {
          // tslint:disable-next-line: max-line-length
          that.http.post('/blxb-newConfession/wallConfession/web/?r=comment/get', new HttpParams().set('id', that.currentId)).subscribe((Response: any) => {
            if (Response.error === 0) {
              alert('发表成功');
              that.commentInput = '';
              // 前端+1
              // tslint:disable-next-line: radix
              that.list[that.currentIndex].count_p = parseInt(that.list[that.currentIndex].count_p) + 1;
              that.cancelComment();
            }
          });
        }
      });
    }
  }
}
