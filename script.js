//dialog
const log = {};

log.area = document.getElementById("log-area");
log.area.parentElement.oncontextmenu = function(ev) { ev.preventDefault() };

log.tooltip = document.getElementById("tooltip");

log.print = function(entry) {
	//get all words (including punctuation)
	let words = entry.split(" ");

	//get number of phrases needed
	let ph = entry.split(/[.,?!:;"'~]\B/g);
	ph = ph.filter(function (s) { return s != "" });

	let phrases = [];
	let wordindex = 0;

	//get phrases (including punctuation)
	for (let i=0; i<ph.length; i++) {
		//create the phrase
		phrases[i] = "";

		//add words to the phrase. stop adding words if word contains a punctuation
		while (wordindex < words.length) {
			let word = words[wordindex];
			phrases[i] += word+" ";
			wordindex++;
			if (!!word.match(/[.,?!:;"'~]/)) {
				break
			}
		}
	}

	//print phrases
	for (let i=0; i<phrases.length; i++) {
		let span = document.createElement("span");
		span.className = "word";

		let phrase = [];
		phrase[0] = phrases[i].replace(/[.,?!:;"'~]\B/g,"").trim();
		phrase[1] = phrases[i].match(/[.,?!:;"'~]\B/g,"").join("");

		span.textContent = phrase[0];

		span.oncontextmenu = function(ev) {
			ev.preventDefault();
			notes.write(phrase[0]);
		};

		log.area.appendChild(span);

		for (let i=1; i<phrase.length; i++) {
			log.area.insertAdjacentHTML('beforeend', phrase[i]);
		}
		log.area.insertAdjacentHTML('beforeend', '&nbsp');
	}
};

log.clear = function() {
	log.area.innerHTML = "";
};

//notepad functionality
var notes = {};
notes.limit = null;
notes.pad = document.getElementById("notepad-content");
notes.pad.parentElement.oncontextmenu = function(ev) { ev.preventDefault() };
notes.write = function(word) {
	if (notes.limit && notes.pad.childElementCount >= notes.limit) {
		return
	}

	let div = document.createElement("div");
	div.className = "word";
	div.textContent = word;

	div.onmousedown = function(ev) {
		ev.preventDefault();

		if (ev.button == 2) {
			if (div.className.includes(" selected")) {
				const index = notes.selected.indexOf(div.textContent);
				notes.selected.splice(index, 1);
			}
			div.remove();
		}

		//function that allows it to get selected
		else if (ev.button == 0) {
			let content = div.textContent;

			//toggle selection
			if (!div.className.includes(" selected")) {
				//if (!notes.selected.includes(content)) {};
				notes.selected.push(content);
				div.className += " selected";
			} else {
				div.classList.remove("selected");
				const index = notes.selected.indexOf(content);
				notes.selected.splice(index, 1);
			}
		}

		if (notes.selected.length > 1) {
			contradiction_button.style.display = "block";
		} else {
			contradiction_button.style.display = "none";
		}
	};

	notes.pad.appendChild(div);
};
notes.selected = [];

//contradiction!
var contradiction_button = document.getElementById("contradiction");
function contradiction() {
	notes.selected = [];
	for (let i=0; i<notes.pad.childNodes.length; i++) {
		notes.pad.childNodes[i].classList.remove("selected");
	}
	contradiction_button.style.display = "none";
}

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


//to do list
//make it so you can't take multiple of the same clue lol