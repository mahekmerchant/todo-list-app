import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { TodoItems } from './app.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });
    service = TestBed.inject(TodoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve todo items from the API', () => {
    const mockUserId = '1';
    const mockItems: TodoItems[] = [{ id: '1', userId: 'user1', text: 'Test Item' }];

    service.getTodoItems(mockUserId).subscribe(items => {
      expect(items).toEqual(mockItems);
    });

    const req = httpTestingController.expectOne(`https://localhost:7157/api/Todo?user=${mockUserId}`);
    expect(req.request.method).toEqual('GET');

    req.flush(mockItems);
  });

  it('should add an item via POST request', () => {
    const mockData = { UserId: '1', Text: 'New Item' };

    service.addItem(mockData).subscribe(() => {
      // No need to assert anything here as addItem() doesn't return anything
    });

    const req = httpTestingController.expectOne('https://localhost:7157/api/Todo/');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(mockData);

    req.flush({});
  });

  it('should delete an item via DELETE request', () => {
    const mockUserId = '1';
    const mockItemId = 'TestItem';

    service.deleteItem(mockUserId, mockItemId).subscribe(() => {
      // No need to assert anything here as deleteItem() doesn't return anything
    });

    const req = httpTestingController.expectOne(`https://localhost:7157/api/Todo?user=${mockUserId}&text=${mockItemId}`);
    expect(req.request.method).toEqual('DELETE');

    req.flush({});
  });
});