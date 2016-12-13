import { Component } from '@angular/core'

@Component({
  selector: 'admin-layout',
  templateUrl: './admin_layout.component.html',
  styleUrls: ['./admin_layout.component.scss']
})
export class AdminLayoutComponent {
  private user_name;

  ngOnInit() {
    this.user_name = JSON.parse(localStorage.getItem('currentUser')).first_name;
  }
}
