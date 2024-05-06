import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { TodoService } from './todo.service';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let todoServiceStub: Partial<TodoService>;
  let toastrServiceStub: Partial<ToastrService>;

  beforeEach(async () => {
    todoServiceStub = {
      getTodoItems: jasmine.createSpy('getTodoItems').and.returnValue(of([])),
      addItem: jasmine.createSpy('addItem').and.returnValue(of()),
      deleteItem: jasmine.createSpy('deleteItem').and.returnValue(of())
    };

    toastrServiceStub = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning')
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule, ToastrModule.forRoot(),AppComponent],
      providers: [
        { provide: TodoService, useValue: todoServiceStub },
        { provide: ToastrService, useValue: toastrServiceStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should load todo items', () => {
    component.formData.UserId = '1';
    component.loadTodoItems();
    expect(todoServiceStub.getTodoItems).toHaveBeenCalledWith('1');
  });

  it('should not load todo items when UserId is empty', () => {
    component.formData.UserId = '';
    component.loadTodoItems();
    expect(todoServiceStub.getTodoItems).not.toHaveBeenCalled();
    expect(toastrServiceStub.warning).toHaveBeenCalledWith('Please enter a user ID.', 'Warning');
  });

  it('should add item', () => {
    component.formData.UserId = '1';
    component.formData.Text = 'Test';
    component.addItem();
    expect(todoServiceStub.addItem).toHaveBeenCalledWith({ UserId: '1', Text: 'Test' });
  });

  it('should not add item when Text is empty', () => {
    component.formData.UserId = '';
    component.formData.Text = '';
    component.addItem();
    expect(todoServiceStub.addItem).not.toHaveBeenCalled();
  });

  it('should not add item when UserId is empty', () => {
    component.formData.UserId = '';
    component.formData.Text = 'Test';
    component.addItem();
    expect(todoServiceStub.addItem).not.toHaveBeenCalled();
  });

  it('should delete item', () => {
    component.formData.UserId = '1';
    component.deleteItem('test');
    expect(todoServiceStub.deleteItem).toHaveBeenCalledWith('1', 'test');
  });

  it('should not delete item when UserId is empty', () => {
    component.formData.UserId = '';
    component.deleteItem('test');
    expect(todoServiceStub.deleteItem).not.toHaveBeenCalled();
    expect(toastrServiceStub.warning).toHaveBeenCalledWith('Please enter a userId before deleting an item.');
  });

  it('should handle error while loading todo items', () => {
    todoServiceStub.getTodoItems = jasmine.createSpy('getTodoItems').and.returnValue(throwError('Error'));
    component.formData.UserId = '1';
    component.loadTodoItems();
    expect(toastrServiceStub.error).toHaveBeenCalledWith('Items not found, add todo list items', 'Error');
  });

  it('should handle error while adding item', () => {
    todoServiceStub.addItem = jasmine.createSpy('addItem').and.returnValue(throwError('Error'));
    component.formData.UserId = '1';
    component.formData.Text = 'Test';
    component.addItem();
    expect(toastrServiceStub.error).toHaveBeenCalledWith('Failed to add new item. Please try again later.', 'Error');
  });

  it('should handle error while deleting item', () => {
    todoServiceStub.deleteItem = jasmine.createSpy('deleteItem').and.returnValue(throwError('Error'));
    component.formData.UserId = '1';
    component.deleteItem('test');
    expect(toastrServiceStub.error).toHaveBeenCalledWith('Failed to delete item. Please try again later.', 'Error');
  });
});