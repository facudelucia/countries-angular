import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  private debouncer: Subject<string> = new Subject<string>()
  private debouncerSubscription?: Subscription


  @Input()
  public placeholder: string = ''

  @Output()
  onValue: EventEmitter<string> = new EventEmitter()

  @ViewChild('txtInput')
  public tagInput!: ElementRef<HTMLInputElement>

  @Output()
  onDebounce: EventEmitter<string> = new EventEmitter()

  @Input()
  public initialValue: string = ''

  ngOnInit(): void {
    this.debouncerSubscription = this.debouncer
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        this.onDebounce.emit(value)
      })
  }

  ngOnDestroy(): void {
    this.debouncerSubscription?.unsubscribe()
  }

  public emitValue(): void {
    const newTag = this.tagInput.nativeElement.value
    if (!newTag) return
    this.onValue.emit(newTag)
  }

  onKeyPress(searchTerm: string): void {
    this.debouncer.next(searchTerm)
  }

}
