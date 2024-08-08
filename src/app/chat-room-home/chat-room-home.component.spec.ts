import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomHomeComponent } from './chat-room-home.component';

describe('ChatRoomHomeComponent', () => {
  let component: ChatRoomHomeComponent;
  let fixture: ComponentFixture<ChatRoomHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatRoomHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatRoomHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
