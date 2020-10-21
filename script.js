//dialog
const log = {};

log.area = document.getElementById("log-area");

log.area.oncontextmenu = function(ev) { ev.preventDefault() };

log.tooltip = document.getElementById("tooltip");

log.print = function(entry) {
	let words = entry.split(" ");
	for (let i=0; i<words.length; i++) {
		let span = document.createElement("span");
		span.className = "word";
		span.textContent = words[i];
		span.oncontextmenu = function(ev) {
			ev.preventDefault();
			notes.write(words[i].replace(/[^a-zA-Z0-9]/g,''))
		};

		log.area.appendChild(span);
		log.area.insertAdjacentHTML('beforeend', '&nbsp');
	}
};

log.clear = function() {
	log.area.innerHTML = "";
};

//notepad functionality

var notes = {};
notes.pad = document.getElementById("notepad-content");
notes.pad.parentElement.oncontextmenu = function(ev) { ev.preventDefault() };
notes.write = function(word) {
	let div = document.createElement("div");
	div.className = "word";
	div.textContent = word;
	div.onmousedown = function(ev) {
		ev.preventDefault();

		if (ev.button == 2) {
			div.remove();
		}
		else if (ev.button == 0) {
			let content = div.textContent;
			if (!div.className.includes(" selected")) {
				if (!notes.selected.includes(content)) {
					notes.selected.push(content);
				};
				div.className += " selected";
			} else {
				div.classList.remove("selected");
				const index = notes.selected.indexOf(content);
				notes.selected.splice(index, 1);
			}
			console.log(notes.selected);
		}
	};

	notes.pad.appendChild(div);
};
notes.selected = [];

//notepad dragging

function dragElement(e) {
	let pos1, pos2, pos3, pos4 = 0;
	if (document.getElementById(e.id + "-header")) {
		document.getElementById(e.id + "-header").onmousedown = drag;
	} else {
		e.onmousedown = drag;
	}

	function drag(ev) {
		ev = ev || window.event;
		ev.preventDefault();

		pos3 = ev.clientX;
		pos4 = ev.clientY;
		document.onmouseup = closeDragElement;
		document.onmousemove = elementDrag;
	}

	function elementDrag(ev) {
		ev = ev || window.event;
		ev.preventDefault();

		pos1 = pos3 - ev.clientX;
		pos2 = pos4 - ev.clientY;
		pos3 = ev.clientX;
		pos4 = ev.clientY;

		e.style.top = (e.offsetTop - pos2) + "px";
		e.style.left = (e.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
	}
}