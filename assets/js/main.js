/**
 * Object Word
 * @param {String} value       The word as String
 * @param {String} lang        The Word's lang -- default is "en"
 * @param {Array} subjects 	   The subjects where the Word belong. -- default is []
 * @param {String} preposition The preposition which fit the word if necessary : "de", "d'", ... -- default is ""
 * @param {String} type        The Word's type : "noun", "adjective", ... -- default is "noun"
 * @param {Integer} position   The prefered position of the word in acronyms : Word.POSITION.ANYWHERE is anywhere, Word.POSITION.START is start, Word.POSITION.MIDDLE is middle, Word.POSITION is end. -- default is Word.POSITION.ANYWHERE
 */
function Word(value, lang, subjects, preposition, type, position){
	lang = typeof lang !== 'undefined' ?  lang : "en";
	type = typeof type !== 'undefined' ?  type : "noun";
	preposition = typeof preposition !== 'undefined' ?  preposition : "";
	position = typeof position !== 'undefined' ?  position : Word.POSITION.ANYWHERE;
	subjects = typeof subjects !== 'undefined' ?  subjects : [];
	this.value = value;
	this.lang = lang;
	this.type = type;
	this.preposition = preposition;
	this.position = position-1; // -1 for array index
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
	this.equals = function(word){
		if(word instanceof Word){
			return word.value == this.value &&
				word.lang == this.lang &&
				word.type == this.type;
		}
		return false;
	};
}
Word.POSITION = {ANYWHERE:0, START:1, MIDDLE:2, END:3}; 
Word.SUBJECT = {ALL:0, ASI:1, PLD:2}; 

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
 * Dictionary, that contains the indexed words
 * @type {Object}
 */
var dict = {
	words:{},
	/**
	 * Insert a Word Object in the dictionary, the Word will be indexed
	 * @param  {Word} word 	The word to insert into the dictionary
	 */
	insert: function(wordToInsert){
		if(wordToInsert instanceof Word){
			if(!words[wordToInsert.lang])
				words[wordToInsert.lang] = [];
			if(!words[wordToInsert.lang][wordToInsert.first()])
				words[wordToInsert.lang][wordToInsert.first()] = [];
			if(!containsWord(words[wordToInsert.lang][wordToInsert.first()], wordToInsert))
				words[wordToInsert.lang][wordToInsert.first()].push(wordToInsert);
		}
	},
	/**
	 * Remove a Word Object from the dictionary
	 * @param  {Word} word The Word to remove
	 * @return {boolean} True if the element had been removed, else False
	 */
	remove: function(wordToRemove){
		if(wordToRemove instanceof Word){
			if(words[wordToRemove.lang] && words[wordToRemove.lang][wordToRemove.first()] && containsWord(words[wordToRemove.lang][wordToRemove.first()], wordToRemove)){
				var wordArray = words[wordToRemove.lang][wordToRemove.first()];
				var i = wordArray.length
				while(i--){
					if (wordArray[i].equals(wordToRemove)) {
						wordArray.splice(i,1);
					};
				}
				return true;
			}
		}
		return false;
	},
	/**
	 * Give a random Word from the dictionary beginning with the given letter
	 * @param  {String} letter 	The letter that must start the returned Word
	 * @return {Word}        	A Word beginning with the letter
	 */
	getRandomWord: function(letter){
		if (!words[userLang][letter]) {
			alert("There is no word starting with '"+letter+"' available.");
			return null;
		}
		else if(words[userLang][letter].length == 0){
			alert("There is not enough words starting with '"+letter+"' available.");
			return null;
		}
		return words[userLang][letter][getRandomIndex(words[userLang][letter].length)];
	}
};

// TODO : add prefered position, subject, ?
// TODO : Structure the words data somewhere else ?
/**
 * Contains aaaaaaaall the words, as a list. The words aren't indexed here.
 * @type {Array}
 */
var words = [
	new Word("Architecture", "fr", [Word.SUBJECT.ASI], "d'", "noun", Word.POSITION.START),
	new Word("Architecture", "en", [Word.SUBJECT.ASI], "", "noun", Word.POSITION.END),
	new Word("Assurance", "fr", [Word.SUBJECT.PLD], "d'", "noun", Word.POSITION.ANYWHERE),
	new Word("Activité", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "d'"),
	new Word("Activity", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),

	new Word("Business", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),

	new Word("Conception", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "de"),
	new Word("Conception", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Client", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Customer", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),

	new Word("Données", "fr", [Word.SUBJECT.ASI], "des"),
	new Word("Donnée", "fr", [Word.SUBJECT.ASI], "de"),
	new Word("Data", "en", [Word.SUBJECT.ASI]),
	new Word("Diagramme", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "de"),
	new Word("Diagram", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], ""),
	// new Word("Design", "en", "noun"),

	new Word("Economy", "en", [Word.SUBJECT.PLD]),
	new Word("Economie", "fr", [Word.SUBJECT.PLD], "d'"),
	new Word("Entreprise", "fr", [Word.SUBJECT.PLD,  Word.SUBJECT.ASI], "d'"),
	new Word("Enterprise", "en", [Word.SUBJECT.PLD, Word.SUBJECT.ASI]),
	new Word("Environment", "en", [Word.SUBJECT.PLD]),
	new Word("Environnement", "fr", [Word.SUBJECT.PLD], "d'"),
	new Word("Entity", "en", [Word.SUBJECT.ASI]),
	new Word("Entité", "fr", [Word.SUBJECT.ASI], "d'"),

	new Word("Fonctionnel", "fr", [Word.SUBJECT.PLD, Word.SUBJECT.ASI],"", "adjective"),
	new Word("Fonctional", "en", [Word.SUBJECT.PLD, Word.SUBJECT.ASI],"", "adjective"),

	new Word("Objet", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "d'"),
	new Word("Object", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Oriented", "en", [Word.SUBJECT.ASI], "", "adjective"),
	new Word("Orienté", "fr", [Word.SUBJECT.ASI], "", "adjective"),

	new Word("Métier", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Modèle", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "du"),
	new Word("Model", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	
	new Word("Plan", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Plan", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Planning", "en", [Word.SUBJECT.PLD, Word.SUBJECT.ASI]),
	new Word("Planification", "fr", [Word.SUBJECT.PLD, Word.SUBJECT.ASI]),

	new Word("Quality", "en", [Word.SUBJECT.PLD]),
	new Word("Qualité", "fr", [Word.SUBJECT.PLD]),

	new Word("Relationship", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Relation", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "de la"),
	new Word("Resource", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Ressource", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "d'"),
	new Word("Ressources", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "des"),
	new Word("Ressources", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Responsable", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "", "noun", Word.POSITION.START),


	new Word("Service", "en", [Word.SUBJECT.ASI]),
	new Word("Service", "fr", [Word.SUBJECT.ASI]),

];
 




// Indexation
for (var i = words.length - 1; i >= 0; i--) {
	dict.insert(words[i]);
};

// TODO organize parameters as userLang (settings object ?)
var userLang = "fr";

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
var getAcronym = function(text){
	var result = [];
	var removedWords = [];
	for (var i = 0; i < text.length; i++) {
		console.log("\nWord for "+text[i].toUpperCase()+", position : "+i);
		// find new word
		var word = dict.getRandomWord(text[i].toUpperCase());
		if(word == null){
			result = [];
			break;
		}
		dict.remove(word);
		removedWords.push(word);
		console.log(word);
		// language logic
		if (userLang == "fr") {
			if(i > 0){
				// add preposition for 2+ word
				result.push(word.preposition + " " + word.value);
			}
			else{
				result.push(word.value);
			}
		}
		else if (userLang == "en") {
			result.push(word.value);
		}
	};
	var i = removedWords.length;
	while (i--) {
		dict.insert(removedWords[i]);
	}
	return result.join(" ");
}
