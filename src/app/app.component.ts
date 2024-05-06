import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import{TodoItems} from './app.model';
import {ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule,HttpClientModule,CommonModule
  ],
  providers:[HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  formData: { UserId: string, Text: string } = { UserId: '', Text: '' };
  todoItem:TodoItems[]=[];
  constructor(private todoService: TodoService,private toastr: ToastrService) {}

  //Gets the Todolist items.
  loadTodoItems(): void {
    if (this.formData.UserId.trim() !== '') {
      this.todoService.getTodoItems(this.formData.UserId).subscribe(items => {
        this.todoItem = items;
      },
      error => {
        this.toastr.error('Items not found, add todo list items', 'Error');
      });
    }else {
      this.toastr.warning('Please enter a user ID.', 'Warning');
    }
  }

  //Add an item to Todo list.
  addItem() {
    if (this.formData.Text.trim() !== '') {
      if (this.formData.UserId.trim() !== '') {
        this.todoService.addItem(this.formData).subscribe(() => {
          this.loadTodoItems();
          this.formData.Text = '';
          this.toastr.success('New item added successfully.', 'Success');
        },
        error => {
          this.toastr.error('Failed to add new item. Please try again later.', 'Error');
        });
      } else {
        this.toastr.warning('Please enter a user ID and a new item text.', 'Warning');
      }
    }
  }

  //Deletes an item from Todo list
  deleteItem(item: string) {
    if (this.formData.UserId.trim() !== '') {
      this.todoService.deleteItem(this.formData.UserId, item).subscribe(() => {
        this.toastr.success('Item deleted successfully.', 'Success');
        if(this.todoItem.length==1)
           this.todoItem=[];
        else
           this.loadTodoItems();
       
      },
      error => {
        this.toastr.error('Failed to delete item. Please try again later.', 'Error');
      });
    } else {
      this.toastr.warning('Please enter a userId before deleting an item.');
    }
  }
}
