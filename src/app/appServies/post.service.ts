import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Posts } from '../appModels/posts.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:3000/api/posts';
  constructor(private http: HttpClient) {}

  createAttendance(id: null, date: string, day: string, time: string) {
    const post: Posts = { date: date, day: day, time: time };
    // const token = localStorage.getItem('token');
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Posts>(this.apiUrl, post);
  }

  getAttendance(
    postsPerPage: number,
    currentPage: number
  ): Observable<{ posts: Posts[]; maxPosts: number }> {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    return this.http
      .get<{ posts: Posts[]; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((resData: any) => {
          // const attenArr = [];
          // for (const key in resData) {
          //   if (resData.hasOwnProperty(key)) {
          //     attenArr.push({ attenId: key, ...resData[key] });
          //   }
          // }
          return {
            posts: resData.posts.map((post: any) => {
              return {
                date: post.date,
                day: post.day,
                time: post.time,
                id: post._id,
              };
            }),
            maxPosts: resData.maxPosts,
          };
        })
      );
  }

  // getAttendanceUpdate(id: string) {
  //   return this.http.get(`http://localhost:3000/api/posts/${id}`);
  // }

  // updateAttendance(postId: string, updatedPostData: any) {
  //   console.log(postId);
  //   return this.http.put(
  //     `http://localhost:3000/api/posts/${postId}`,
  //     updatedPostData
  //   );
  // }

  updateAttendance(
    id: string,
    date: string,
    day: string,
    time: string
  ): Observable<any> {
    const post: Posts = { date: date, day: day, time: time };
    return this.http.put(`http://localhost:3000/api/posts/${id}`, post);
  }

  deleteAttendance(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
