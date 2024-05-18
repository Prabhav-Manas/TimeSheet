import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { PostService } from '../appServies/post.service';
import { Posts } from '../appModels/posts.model';
import { AuthService } from '../appServies/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-emp-dashboard',
  templateUrl: './emp-dashboard.component.html',
  styleUrls: ['./emp-dashboard.component.css'],
})
export class EmpDashboardComponent implements OnInit, OnDestroy {
  attendanceForm: any = FormGroup;
  attendance: Posts[] = [];
  attendancePosts: boolean = true;
  editMode: boolean = false;
  editAttendanceId: any;
  modelOpen: boolean = true;
  totalAttendance = 10;
  postsPerPage = 4;
  currentPage = 1;
  pageSizeOption = [1, 2, 5, 10];

  userIsAuthenticated: boolean = false;
  private authStatusSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private _postService: PostService,
    private _authService: AuthService
  ) {
    this.attendanceForm = this.fb.group({
      date: new FormControl('', [Validators.required]),
      day: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.fetchAttendance();
    this.userIsAuthenticated = this._authService.getIsAuth();
    this.authStatusSub = this._authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  // --- Edit & Save / Add Attendance ---
  onSubmit(attendanceFormData: Posts) {
    if (this.attendanceForm.valid) {
      const id = this.editAttendanceId;
      const date = this.attendanceForm.value.date;
      const day = this.attendanceForm.value.day;
      const time = this.attendanceForm.value.time;

      if (this.editMode == true) {
        if (this.editAttendanceId) {
          this._postService
            .updateAttendance(id, date, day, time)
            .subscribe((response: any) => {
              console.log(response);
              this.fetchAttendance();
              // this.handleFormSubmissionResponse(response);
            });
        }
        this.editAttendanceId = null;
      } else {
        this.editMode = false;
        this._postService
          .createAttendance(id, date, day, time)
          .subscribe((res) => {
            console.log(res);
            this.fetchAttendance();
            // this.handleFormSubmissionResponse(res);
          });
      }
      this.attendanceForm.reset();
    }
  }

  // --- Fetch Attendance ---
  fetchAttendance() {
    this._postService
      .getAttendance(this.postsPerPage, this.currentPage)
      .subscribe((transformedPostsData) => {
        this.attendance = transformedPostsData.posts;
        this.totalAttendance = transformedPostsData.maxPosts;
        console.log(transformedPostsData);
      });
  }

  // === Pagination ===
  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    // this._postService.getAttendance(this.postsPerPage, this.currentPage);
    this.fetchAttendance();
  }

  // --- Edit Attendance ---
  onEditAttendance(postId: any, index: number) {
    this.editMode = true;
    this.editAttendanceId = postId;
    console.log('Attendance EditID:=>', this.editAttendanceId);
    this.attendanceForm.setValue({
      date: this.attendance[index].date,
      day: this.attendance[index].day,
      time: this.attendance[index].time,
    });
  }

  // --- Delete Attendance ---
  onDelete(postId: any) {
    console.log('DELETE Method:=>', postId);
    if (confirm('Do you want to delete this ?')) {
      this._postService.deleteAttendance(postId).subscribe(
        (res) => {
          setTimeout(() => {
            alert('Deleted! ✅');
          }, 1000);
          this.fetchAttendance();
        },
        (err) => {
          alert('Something went wrong! ⚠️');
          console.log(err);
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onDisacrd() {
    if (this.attendanceForm.value) {
      this.attendanceForm.reset();
      this.editMode = false;
    }
  }

  onCloseModelForm() {
    if (this.attendanceForm.value) {
      this.onDisacrd();
      this.editMode = false;
    }
  }

  handleFormSubmissionResponse(response: Posts) {
    if (response) {
      // this.modelOpen = false;
    } else {
      alert('Error ⚠️');
    }
  }
}
