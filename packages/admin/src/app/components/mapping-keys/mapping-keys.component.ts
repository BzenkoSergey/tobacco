import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { MappingKeyDto } from '@rest/shared';

@Component({
	selector: 'mapping-keys',
	templateUrl: './mapping-keys.html',
	styleUrls: ['./mapping-keys.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MappingKeysComponent),
			multi: true,
		}
	]
})

export class MappingKeysComponent implements ControlValueAccessor {
	@Input() items: MappingKeyDto[] = [];

	protected onChange: (items: MappingKeyDto[]) => void;

	add() {
		const item = new MappingKeyDto();
		this.items.unshift(item);
		this.setValue(this.items);
	}

	remove(item: MappingKeyDto) {
		this.items = this.items.filter(i => item !== i);
		this.setValue(this.items);
	}

	setValue(items: MappingKeyDto[]) {
		this.writeValue(items);
		this.onChange(items);
	}

	writeValue(items: MappingKeyDto[]) {
		this.items = items;
	}

	registerOnChange(fn: (items: MappingKeyDto[]) => void) {
		this.onChange = fn;
	}

	setDisabledState() {}
	registerOnTouched() {}
}
