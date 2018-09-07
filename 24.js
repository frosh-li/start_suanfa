// const inputs = [1,4,3,6];
const inputs = [3,3,7,10];
const operator = ['+', '-', '*', '/'];
let noResults = [];

function calcTwo(num1, num2, express1) {

	// console.log('calcTwo',num1, num2, express1);
	let exp1;
	let exp2;
	// console.log('eval',num1, num2, eval(`${express1}`))
	if(num1 == eval(`${express1}`)) {
		exp1 = express1;
		exp2 = num2;
	}else if(num2 == eval(`${express1}`)) {
		exp1 = num1;
		exp2 = express1;
	}else {
		//console.log('nonono')
		exp1 = num1;
		exp2 = num2;
		return ''
	}
	if(num1 + num2 === 24) {
		return `${exp1} + ${exp2} = 24`;
	}else if(num1 - num2 === 24) {
		return `${exp1} - ${exp2} = 24`;
	}else if(num1 * num2 === 24) {
		return `${exp1} x ${exp2} = 24`;
	}else if(num1 / num2 === 24) {
		return `${exp1} ÷ ${exp2} = 24`;
	}else if(num2 / num1 === 24) {
		return `${exp2} ÷ ${exp1} = 24`;
	}else if(num2 - num1 === 24) {
		return `${exp2} - ${exp1} = 24`;
	}else {
		return ''
	}
}

function calcAll(inputs, express, origin) {
	// console.log('express',express)
	// console.log(express1,express2)
	if(inputs.length === 2) {
		let out = calcTwo(...inputs, express);
		if(out) {
			// console.log(out)
			console.log(out)
		}else {
			// noResults.push(origin);
		}

		return true;
	}
	for(let a1 = 0 ; a1 < inputs.length ; a1++){
		let num1 = inputs[a1];
		for(let a2 = a1+1 ; a2 < inputs.length ; a2++) {
			let num2 = inputs[a2];

			let newArray = Array.from(inputs);
			newArray.splice(a1,1);
			newArray.splice(a2-1,1);
			// console.log([num1,num2, ...newArray]);
			if(express === ""){
				calcAll([num1+num2, ...newArray], `(${num1} + ${num2})`, origin);
				calcAll([num1-num2, ...newArray], `(${num1} - ${num2})`, origin);
				calcAll([num2-num1, ...newArray], `(${num2} - ${num1})`, origin);
				calcAll([num1*num2, ...newArray], `${num1} * ${num2}`, origin);
				calcAll([num1/num2, ...newArray], `${num1} / ${num2}`, origin);
				calcAll([num2/num1, ...newArray], `${num2} / ${num1}`, origin);
			}else{
				calcAll([num1+num2, ...newArray], `(${express} + ${num2})`, origin);
					calcAll([num1-num2, ...newArray], `(${express} - ${num2})`, origin);
					calcAll([num2-num1, ...newArray], `(${num2} - ${express})`, origin);
					calcAll([num1*num2, ...newArray], `${express} * ${num2}`, origin);
					calcAll([num1/num2, ...newArray], `${express} / ${num2}`, origin);
					calcAll([num2/num1, ...newArray], `${num2} / ${express}`, origin);
			}

		}
	}

}

console.log('输入',inputs)
let sTime = new Date();
// for(let i1 = 1 ; i1 <= 13 ; i1++) {
// 	let a1 = i1;
// 	for(let i2 = 1 ; i2 <= 13 ; i2++) {
// 		let a2 = i2;
// 		for(let i3 = 1 ; i3 <= 13 ; i3++) {
// 			let a3 = i3;
// 			for(let i4 = 1 ; i4 <= 13 ; i4++) {
// 				let a4 = i4;
// 				calcAll([a1,a2,a3,a4], '',[a1,a2,a3,a4]);
// 			}
// 		}
// 	}
// }
calcAll(inputs, '',inputs);
// console.log('无解的有',noResults);
// calcAll(inputs, '', '');
console.log(new Date() - sTime+"ms");
