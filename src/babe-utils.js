function loop(arr, count, shuffleFlag) {
	return _.flatMapDeep(_.range(count), function(i) {
		return arr;
	});
}

function loopShuffled(arr, count) {
	return _.flatMapDeep(_.range(count), function(i) {
		return _.shuffle(arr);
	});
}
