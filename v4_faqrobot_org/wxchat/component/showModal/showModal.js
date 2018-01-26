function showModal() {
	this.data = {
		SM_show: false
	}
}

showModal.prototype = {
	hide: function(that) {
		console.log(11)
		console.log(that)
		
	}
}

exports.showModal = new showModal()

