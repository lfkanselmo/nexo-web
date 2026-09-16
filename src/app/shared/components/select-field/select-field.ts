import { Component, ElementRef, HostListener, forwardRef, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'nexo-select-field',
  standalone: true,
  templateUrl: './select-field.html',
  styleUrl: './select-field.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectField),
      multi: true,
    },
  ],
})
export class SelectField implements ControlValueAccessor {
  private readonly host = inject(ElementRef<HTMLElement>);

  label = input('');
  options = input.required<SelectOption[]>();
  placeholder = input('Seleccionar...');

  protected value = signal('');
  protected disabled = signal(false);
  protected open = signal(false);
  protected activeIndex = signal(-1);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected get selectedLabel(): string | null {
    return this.options().find((option) => option.value === this.value())?.label ?? null;
  }

  protected toggle(): void {
    if (this.disabled()) {
      return;
    }
    this.open.update((value) => !value);
    if (this.open()) {
      this.activeIndex.set(this.options().findIndex((option) => option.value === this.value()));
    } else {
      this.onTouched();
    }
  }

  protected select(option: SelectOption): void {
    this.value.set(option.value);
    this.onChange(option.value);
    this.open.set(false);
    this.onTouched();
  }

  protected handleKeydown(event: KeyboardEvent): void {
    const options = this.options();

    if (event.key === 'Escape') {
      this.open.set(false);
      return;
    }
    if ((event.key === 'Enter' || event.key === ' ') && this.open() && this.activeIndex() >= 0) {
      event.preventDefault();
      this.select(options[this.activeIndex()]);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.open()) {
        this.open.set(true);
        this.activeIndex.set(Math.max(0, options.findIndex((option) => option.value === this.value())));
        return;
      }
      const delta = event.key === 'ArrowUp' ? -1 : 1;
      this.activeIndex.update((index) => Math.min(options.length - 1, Math.max(0, index + delta)));
    }
  }

  @HostListener('document:click', ['$event'])
  protected handleDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
      this.onTouched();
    }
  }
}
