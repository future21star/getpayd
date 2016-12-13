import { Component, OnInit }        from '@angular/core';
import { Content }                  from '../../_models/index'
import { UserService, AdminService }             from '../../_services/index';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    templateUrl: 'video_activity.component.html',
    styleUrls: [ './video_activity.component.scss' ]
})
export class VideoActivityComponent implements OnInit{
  private content;
  private isLoading: boolean = true;
  private user;
  private points_awarded:number = 0;

  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ){ }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getContent(params['id']);
      this.getUserInfo(JSON.parse(localStorage.getItem('currentUser'))._id);
      this.points_awarded = 100;
    });
  }

  getContent(id) {
    this.adminService.getContent(id).subscribe(
      data => this.content = data,
      error => console.log(error),
      () => {this.isLoading = false}
    );
  }

  getUserInfo(id){
    this.adminService.getUser(id).subscribe(
      data => {
        this.user = data;
      },
      error => console.log(error),
      () => {this.isLoading = false}
    );
  }

  onFinish() {
    if (!this.user.activities){
      this.user.activities = [];
    }
    let current_date = new Date();
    this.user.activities.push({
      user: this.user.first_name+" "+this.user.last_name,
      content: this.content,
      points_awarded: this.points_awarded,
      date: current_date
    });  
    this.adminService.editUser(this.user)
      .subscribe(
          data => {
                this.router.navigate(['/user/user']);                    
              },
          error => {
            console.log(error);
          },
          () => { }
      );  
  }
}
