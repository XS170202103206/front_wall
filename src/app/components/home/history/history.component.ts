import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  public showLoading: any = true;
  public myList: any[];
  public showComment: any = false;
  public myHeight: any;
  public commentInput: any = '';
  public currentId: any = -1;
  public likeFlagArr: Array<boolean>;
  public currentIndex: any;
  public username = JSON.parse(localStorage.getItem('formUsername'));

  constructor(public http: HttpClient, public router: Router, private titleService: Title) {
    this.titleService.setTitle('主页');
  }

  ngOnInit() {
    localStorage.setItem('lastTab', JSON.stringify(1));
    const that = this;
    const getConentParams = new HttpParams().set('username', this.username);
    const getLikeParams = new HttpParams().set('username', this.username);
    const getConentUrl = '/blxb-newConfession/wallConfession/web/?r=content/record';
    const getLikeUrl = '/blxb-newConfession/wallConfession/web/?r=content/showlike';
    // 主页数据
    this.http.post(getConentUrl, getConentParams).subscribe((response: any) => {
      if (response.error === 0) {
        const list = response.data;
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
        that.myList = list;
        console.log(list);
      }
    });
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
    this.myList[idx].likecount = parseInt(this.myList[idx].likecount) + 1;
    // 点赞
    const that = this;
    const params = new HttpParams().set('formid', id).set('dzSum', this.myList[idx].likecount).set('username', this.username);
    const url = '/blxb-newConfession/wallConfession/web/?r=content/likerender';
    this.http.post(url, params).subscribe((response: any) => {
      if (response.error === 0) {
        console.log(response);
      }
      console.log(response);
    });
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
              that.myList[that.currentIndex].count_p = parseInt(that.myList[that.currentIndex].count_p) + 1;
              that.cancelComment();
            }
          });
        }
      });
    }
  }

  delete(event, idx) {
    if (confirm('确定要删除吗？')) {
      const id = event.target.id;
      // https://www.myzhbit.cn/blxb-newConfession/wallConfession/web/?r=content/delete
      const that = this;
      const params = new HttpParams().set('formid', id);
      const url = '/blxb-newConfession/wallConfession/web/?r=content/delete';
      this.http.post(url, params).subscribe((response: any) => {
        if (response.error === 0) {
          // console.log(response);
          alert('删除成功');
          // 删除数组元组
          that.myList.splice(idx, 1);
          console.log(that.myList);
        }
      });
    } else {
      return;
    }
  }
}
