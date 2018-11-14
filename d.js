// var str = "##";
// var star = "##";
// var spaces = 14;

// for(var i = 0; i < 13; i++){
// 	spaces = spaces - 1;
// 	var spacesLine = '';
// 	for(var g = 0; g < spaces; g++) {
// 		spacesLine += ' ';
// 	}
//     str = str + star;
//     console.log(spacesLine + str + spacesLine);
// }


// for (var i = 500; i <= 999; i++) {
// 	var n = i + '';
// 	if (n[0] === n[2]) {
// 		console.log(i);
// 	}
// }

// 232
// 232

// 454




var str = "##";		// ячейка для решеток
var spaseline = 14;	// количество пробелов

// Генерация нового рядка (14 рядкив)
for(var i = 0; i < 13; i++) {

	// генерация пробелов для определенного рядка
	var spase = " " // обьявляем ячейку для пробелов
	spaseline = spaseline -1 // управляем количеством пробелов, -1 для каждого нового рядка

	// генерируем пробелы по заданнному количеству
	for (var k = 0; k <spaseline; k++) {
		spase = spase + " "  // добавляем пробел до ячейке пробелов
	};

	// добавляем решетки в ячейку
	str = str + "##";

	// выводим ячейку пробелов и добавляем ячейку решеток
	console.log( spase + str);
}



// var str = "##";
// var star = "##";
// for(var i = 0; i < 13; i++) {
// 	var spase = " ";
// 	// spase = (-2)
// 	for (var d = 1; d < 0; d++) {
// 		str += star;
// 		console.log(spase + str);
// 	}
// }
