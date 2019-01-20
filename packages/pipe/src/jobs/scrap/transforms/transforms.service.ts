import { GrabberTransform } from './transform.enum';
import { numberify } from './numberify';
import { booleanify } from './booleanify';
import { trim } from './trim';
import { replace } from './replace';
import { replaceRegexp } from './replace-regexp';
import { prefix } from './prefix';
import { postfix } from './postfix';
import { match } from './match';

export class TransformsService {
	perform(value: string, transform: GrabberTransform, options: any) {
		if(!value) {
			return value;
		}
		if(transform === GrabberTransform.NUMBERIFY) {
			return numberify(value);
		}
		if(transform === GrabberTransform.BOOLEANIFY) {
			return booleanify(value, options);
		}
		if(transform === GrabberTransform.TRIM) {
			return trim(value);
		}
		if(transform === GrabberTransform.REPLACE) {
			return replace(value, options);
		}
		if(transform === GrabberTransform.REPLACE_REGEXP) {
			return replaceRegexp(value || '', options.split('|'));
		}
		if(transform === GrabberTransform.PREFIX) {
			return prefix(value, options);
		}
		if(transform === GrabberTransform.POSTFIX) {
			return postfix(value, options);
		}
		if(transform === GrabberTransform.MATCH) {
			return match(value || '', options.split('|'));
		}

		return value;
	}
}