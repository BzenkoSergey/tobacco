export function doEval(value: any, expression: string) {
	// console.log(value, expression);
	if(value === 0) {
		debugger;
	}
	return eval(expression);
}