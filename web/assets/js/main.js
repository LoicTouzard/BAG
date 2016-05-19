var getKeyByValue = function(value, array){
	for( var i in array){
		if(array[i] == value){
			return i;
		}
	}
	return null;
}
/**
 * Object Word
 * @param {String} value       The word as String
 * @param {String} lang        The Word's lang -- default is "en"
 * @param {Array} subjects 	   The subjects where the Word belong. -- default is []
 * @param {String} preposition The preposition which fit the word if necessary : "de", "d'", ... -- default is ""
 * @param {String} type        The Word's type : "noun", "adjective", ... -- default is "noun"
 * @param {String} position   The prefered position of the word in acronyms : Word.POSITION.ANYWHERE is anywhere, Word.POSITION.START is start, Word.POSITION.MIDDLE is middle, Word.POSITION is end. -- default is Word.POSITION.ANYWHERE
 *                             If The type is "adjective" the default position depends of the lang.
 */
function Word(value, lang, subjects, preposition, type, position){
	lang = typeof lang !== 'undefined' ?  lang : "en";
	type = typeof type !== 'undefined' ?  type : "noun";
	preposition = typeof preposition !== 'undefined' ?  preposition : "";
	position = typeof position !== 'undefined' ?  position : Word.POSITION.ANYWHERE;
	if(typeof position !== 'undefined'){
		if(type == 'adjective'){
			// if the position of an adjective isn't defined
			switch(lang){
				case 'fr':
					position = Word.POSITION.END;
					break;
				case 'en':
					position = Word.POSITION.START;
					break;
				default :
					position = Word.POSITION.ANYWHERE;
			}
		}
		else{
			position = Word.POSITION.ANYWHERE;
		}
	}
	subjects = typeof subjects !== 'undefined' ?  subjects : [];
	this.value = value;
	this.lang = lang;
	this.type = type;
	this.preposition = preposition;
	this.position = position;
	this.subjects = subjects;
	this.subjects.push(Word.SUBJECT.ALL);

	this.first = function(){
		return value[0].toUpperCase();
	};
	this.startWithVowel = function(){
		var vowels = ["A","E","I","O","U","Y"];
		var i = vowels.length;
		while (i--) {
			if (vowels[i] === this.first()) {
				return true;
			}
		}
		return false;
	};
	/**
	 * Determine if the current is equal to another
	 * @param  {Word} word 	  The Word to wompare with.
	 * @return {boolean}      True if the Word is equal to the current Word, else false.
	 */
	this.equals = function(word){
		if(word instanceof Word){
			return word.value == this.value &&
				word.lang == this.lang &&
				word.type == this.type;
		}
		return false;
	};
}
/**
 * Define the preferred position for a word
 * Use Word.POSITION.ANYWHERE when the word can fit anywhere in an Acronym (default constructor value)
 * Use Word.POSITION.START when the word can only be placed at the beginning of the word
 * Use Word.POSITION.MIDDLE when the word can't be placed at the beginning, nor the end of the word
 * Use Word.POSITION.END when the word can only be placed at the end of the word
 * @type {Object}
 */
Word.POSITION = {ANYWHERE:"ANY", START:"START", MIDDLE:"MID", END:"END"};
/**
 * The available subjects for Words.
 * Don't use Word.SUBJECT.ALL, it is automatically added to every created Word.
 * Word.SUBJECT.BULLSHIT isn't a subject but it represents a pool of bullshit words.
 * If no word are found for a given subject, we can search in bullshit to find one.
 * @type {Object}
 */
Word.SUBJECT = {ALL:"ALL", BULLSHIT:"BULLSHIT", ASI:"ASI", PLD:"PLD"}; 

Word.constructFromJson = function(json){
	var arraySubjects = [];
	for (var i = 0; i < json.subjects.length; i++) {
		arraySubjects.push(Word.SUBJECT[json.subjects[i]]);
	};
	return new Word(json.value, json.lang, arraySubjects, json.preposition, json.type, Word.POSITION[json.position]);
};

/**
 * Determine if an object is contained in an array (by reference)
 * @param  {array} array 	The array to search in
 * @param  {Object} obj   	The object you want to find
 * @return {boolean}       	True if the object is in the array, else False
 */
function contains(array, obj) {
	var i = array.length;
	while (i--) {
		if (array[i] === obj) {
			return true;
		}
	}
	return false;
}

/**
 * Tell if array contains the Word object word, the comparison is done with Word.equals
 * @param  {Object} array The array to search into
 * @param  {Word} 	word  The world to search in the array
 * @return {boolean}      Return True if the word is contained in arr, else, false
 */
var containsWord = function(array, word) {
	var i = array.length;
	while (i--) {
		if (array[i] instanceof Word && word instanceof Word && array[i].equals(word)) {
			return true;
		}
	}
	return false;
}

/**
 * Remove a Word from an array, the comparison is done with Word.equals
 * @param  {array} array The array to remove into
 * @param  {Word} word  The object Word to remove
 * @return {boolean}       True if the word has been removed, else False
 */
var removeWord = function(array, word) {
	var i = array.length;
	while (i--) {
		if (array[i] instanceof Word && word instanceof Word && array[i].equals(word)) {
			array.pop(i);
			return true;
		}
	}
	return false;
}

/**
 * Dictionary, that contains the indexed words and some utility functions
 * @type {Object}
 */
var dict = {
	/**
	 * Contains the words of the dictionnary
	 * It is composed of an arrays and sub-arrays structure.
	 * Structure :
	 * 	word[lang][subject][letter][position] = [Word, Word, Word, ...]
	 * @type {Object}
	 */
	words:{},
	/**
	 * Insert a Word Object in the dictionary, the Word will be indexed
	 * @param  {Word} word 	The word to insert into the dictionary
	 */
	insert: function(wordToInsert){
		if(wordToInsert instanceof Word){
			// if the lang doesn't exists, create the array
			if(!this.words[wordToInsert.lang])
				this.words[wordToInsert.lang] = {};
			for (var i in wordToInsert.subjects) {
				// if the subject doesn't exists, create the array
				if(!this.words[wordToInsert.lang][wordToInsert.subjects[i]])
					this.words[wordToInsert.lang][wordToInsert.subjects[i]] = {};
				// if the letter doesn't exists, create the array
				if(!this.words[wordToInsert.lang][wordToInsert.subjects[i]][wordToInsert.first()])
					this.words[wordToInsert.lang][wordToInsert.subjects[i]][wordToInsert.first()] = {}
				// if the position doesn't exists, create the array
				if(!this.words[wordToInsert.lang][wordToInsert.subjects[i]][wordToInsert.first()][wordToInsert.position])
					this.words[wordToInsert.lang][wordToInsert.subjects[i]][wordToInsert.first()][wordToInsert.position] = [];
				// if the Word isn't already inserted, insert it
				if(!containsWord(this.words[wordToInsert.lang][wordToInsert.subjects[i]][wordToInsert.first()][wordToInsert.position], wordToInsert))
					this.words[wordToInsert.lang][wordToInsert.subjects[i]][wordToInsert.first()][wordToInsert.position].push(wordToInsert);
			};
		}
	},
	/**
	 * Remove a Word Object from the dictionary
	 * @param  {Word} word The Word to remove
	 * @return {boolean} True if the element had been removed, else False
	 */
	remove: function(wordToRemove){
		if(wordToRemove instanceof Word){
			if(	this.words[wordToRemove.lang]){
				for (var i = wordToRemove.subjects.length - 1; i >= 0; i--) {
					if (this.words[wordToRemove.lang][wordToRemove.subjects[i]][wordToRemove.first()]
						&& this.words[wordToRemove.lang][wordToRemove.subjects[i]][wordToRemove.first()][wordToRemove.position]
						&& containsWord(this.words[wordToRemove.lang][wordToRemove.subjects[i]][wordToRemove.first()][wordToRemove.position], wordToRemove)) {
						var wordArray = this.words[wordToRemove.lang][wordToRemove.subjects[i]][wordToRemove.first()][wordToRemove.position];
						var i = wordArray.length
						while(i--){
							if (wordArray[i].equals(wordToRemove)) {
								wordArray.splice(i,1);
							}
						}
						return true;
					}
				}
			}
		}
		return false;
	},
	/**
	 * Give a random Word from the dictionary beginning with the given letter
	 * @param  {String} letter 	 The letter that must start the returned Word
	 * @param  {String} lang 	 The lang of the Word
	 * @param  {String} subject  The subject from Word.SUBJECT of the Word
	 * @param  {String} position The position from Word.POSITION of the Word
	 * @return {Object}          Response Object with 2 attributes:
	 *                                   (boolean)'found', if true, the attribute (Word)'word' exists with the picked Word
	 *                                   				 , if false, the attribute (String)'msg' exists and contains the error message
	 */
	getRandomWord: function(letter, lang, subject, position){
		if(!this.words[lang]){
			return {found: false, msg: "There is no word for the language '"+lang+"' available."};
		}
		if (!this.words[lang][subject]) {
			return {found: false, msg: "There is no word for the subject '"+subject+"' available."};
		}
		if (!this.words[lang][subject][letter]) {
			return {found: false, msg: "There is no word starting with '"+letter+"' available."};
		}
		if (!this.words[lang][subject][letter][position]) {
			// change this error msg ?
			return {found: false, msg: "There is no word starting with '"+letter+"' available."};
		}
		else if(this.words[lang][subject][letter][position].length == 0){
			return {found: false, msg: "There is not enough words starting with '"+letter+"' available."};
		}
		return {found: true, word: this.words[lang][subject][letter][position][getRandomIndex(this.words[lang][subject][letter][position].length)]};
	}
};

/**
 * Contains aaaaaaaall the words, as a list. The words aren't indexed here.
 * NB IMPORTANT : If  you want to add some words, please follow these rules : 
 * 		- check how the Word() constructor works. It is documented. Default values may save you some time.
 * 		- Add singular words, the number gestion will be added later.
 * 		- Write them in the right place. In the letter they belong.
 * 		- Add only Words that can fit easily in almost ANY acronym, not only the one you have in mind.
 */


/**
 * Return random number between 0 and size-1
 * @param  {Integer} size The excluded maximum
 * @return {Integer}      A random Integer between 0 and size-1
 */
var getRandomIndex = function(size){
	return parseInt(Math.floor(Math.random()*size));
};

/**
 * Return a random element in the array given
 * @param  {array} array 	The array to pick into
 * @return {Object}       	A random element of the array
 */
var getRandomElement = function(array){
	return array[getRandomIndex(array.length)];
};

/**
 * Calculate and find an acronym from the dictionary dict
 * @param  {String} text The word to "Acronymyze"
 * @return {String}      The word text meaning, letter by letter.
 */
var getAcronym = function(text, lang, subject){
	if(text.toUpperCase()=="BAG") return "Bullshit Acronym Generator";
	var result = [];
	var removedWords = [];
	// if we can't find a word at a specific position we can search to the next position
	var positionsStartOrder = [Word.POSITION.START, Word.POSITION.ANYWHERE, Word.POSITION.MIDDLE, Word.POSITION.END];
	var positionsEndOrder = [Word.POSITION.END, Word.POSITION.ANYWHERE, Word.POSITION.MIDDLE, Word.POSITION.START];
	var positionsMiddleOrder = [Word.POSITION.MIDDLE, Word.POSITION.ANYWHERE, Word.POSITION.START, Word.POSITION.END];
	for (var i = 0; i < text.length; i++) {
		var positionsOrder = (i==0)?positionsStartOrder:(i==text.length-1)?positionsEndOrder:positionsMiddleOrder;
		var positionIndex = 0;


		/*** Word Selection ***/

		console.log("\nWord for "+text[i].toUpperCase()+", index : "+i+', lang : '+lang+', subject : '+getKeyByValue(subject, Word.SUBJECT)+', position : '+getKeyByValue(positionsOrder[positionIndex], Word.POSITION));
		var response = dict.getRandomWord(text[i].toUpperCase(), lang, subject, positionsOrder[positionIndex]);
		while(response.found == false && positionIndex < positionsOrder.length)
		{
			// couldn't find a word for this subject and position, we change the position
			console.log("Word not found ...");
			positionIndex++;
			console.log("Word for "+text[i].toUpperCase()+", index : "+i+', lang : '+lang+', subject : '+getKeyByValue(subject, Word.SUBJECT)+', position : '+getKeyByValue(positionsOrder[positionIndex], Word.POSITION));
			response = dict.getRandomWord(text[i].toUpperCase(), lang, subject, positionsOrder[positionIndex]);
		}

		if(response.found == false){
			// response is still false, there is no word for this subject, we change the subject to Word.SUBJECT.BULLSHIT
			console.log("Word not found ...");
			if(subject == Word.SUBJECT.ALL){
				// if the subject was ALL, we can't search anywhere else ...
				alert(response.msg);
				result = [];
				break;	
			}
			
			positionIndex = 0;
			console.log("Word for "+text[i].toUpperCase()+", index : "+i+', lang : '+lang+', subject : '+getKeyByValue(Word.SUBJECT.BULLSHIT, Word.SUBJECT)+', position : '+getKeyByValue(positionsOrder[positionIndex], Word.POSITION));
			response = dict.getRandomWord(text[i].toUpperCase(), lang, Word.SUBJECT.BULLSHIT, positionsOrder[positionIndex]);
			while(response.found == false && positionIndex < positionsOrder.length)
			{
				// couldn't find a word for this Word.SUBJECT.BULLSHIT and position, we change the position
				console.log("Word not found ...");
				positionIndex++;
				console.log("Word for "+text[i].toUpperCase()+", index : "+i+', lang : '+lang+', subject : '+getKeyByValue(Word.SUBJECT.BULLSHIT, Word.SUBJECT)+', position : '+getKeyByValue(positionsOrder[positionIndex], Word.POSITION));
				response = dict.getRandomWord(text[i].toUpperCase(), lang, Word.SUBJECT.BULLSHIT, positionsOrder[positionIndex]);
			}

			if(response.found == false){
				console.log("Word not found ...");
				alert(response.msg);
				result = [];
				break;	
			}
		}


		var word = response.word;
		dict.remove(word);
		removedWords.push(word);
		console.log(word);


		/*** Language Logic ***/

		if (lang == "fr") {
			if(i > 0){
				// add preposition for 2+ word
				result.push(word.preposition + word.value);
			}
			else{
				result.push(word.value);
			}
		}
		else if (lang == "en") {
			result.push(word.value);
		}
	};
	var i = removedWords.length;
	while (i--) {
		dict.insert(removedWords[i]);
	}
	return result.join(" ");
}



// Load Words
$(function(){
	$.getJSON( "data/words.json", function( json ) {
		// Indexation
		for (var i = json.length - 1; i >= 0; i--) {
			dict.insert(Word.constructFromJson(json[i]));
		};
		$("body").trigger("words-loaded");
	});
});
