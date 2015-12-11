/**
 * Object Word
 * @param {String} value       The word as String
 * @param {String} lang        The Word's lang -- default is "en"
 * @param {String} type        The Word's type : "noun", "adjective", ... -- default is "noun"
 * @param {String} preposition The preposition wich fit the word if necessary : "de", "d'", ... -- default is ""
 */
function Word(value, lang, type, preposition){
	lang = typeof lang !== 'undefined' ?  lang : "en";
	type = typeof type !== 'undefined' ?  type : "noun";
	preposition = typeof preposition !== 'undefined' ?  preposition : "";
	this.value = value;
	this.lang = lang;
	this.type = type;
	this.preposition = preposition;
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
	insert: function(word){
		if(word instanceof Word){
			if(!words[word.lang])
				words[word.lang] = [];
			if(!words[word.lang][word.first()])
				words[word.lang][word.first()] = [];
			if(!containsWord(words[word.lang][word.first()], word))
				words[word.lang][word.first()].push(word);
		}
	},
	/**
	 * Remove a Word Object from the dictionary
	 * @param  {Word} word The Word to remove
	 */
	remove: function(word){
		if(word instanceof Word){
			if(words[word.lang] && words[word.lang][word.first()] && containsWord(words[word.lang][word.first()], word))
				words[word.lang][word.first()].pop(word);
		}
	},
	/**
	 * Give a random Word from the dictionary beginning with the given letter
	 * @param  {String} letter 	The letter that must start the returned Word
	 * @return {Word}        	A Word beginning with the letter
	 */
	getRandomWord: function(letter){
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
	new Word("Architecture", "fr", "noun", "d'"),
	new Word("Architecture", "en", "noun"),
	new Word("Assurance", "fr", "noun", "d'"),
	new Word("Activité", "fr", "noun", "d'"),
	new Word("Activity", "en", "noun"),

	new Word("Business", "en", "noun"),

	new Word("Conception", "fr", "noun", "de"),
	new Word("Conception", "en", "noun"),

	new Word("Données", "fr", "noun", "des"),
	new Word("Donnée", "fr", "noun", "de"),
	new Word("Data", "en", "noun"),
	new Word("Diagramme", "fr", "noun", "de"),
	new Word("Diagram", "en", "noun"),
	new Word("Design", "en", "noun"),

	new Word("Entreprise", "fr", "noun", "d'"),
	new Word("Enterprise", "en", "noun"),
	new Word("Environment", "en", "noun"),
	new Word("Environnement", "fr", "noun", "d'"),
	new Word("Entity", "en", "noun"),
	new Word("Entité", "fr", "noun", "d'"),
	new Word("Economy", "en", "noun"),
	new Word("Economie", "fr", "noun", "d'"),

	new Word("Fonctionnel", "fr", "adjective"),
	new Word("Fonctional", "en", "adjective"),

	new Word("Objet", "fr", "noun", "d'"),
	new Word("Object", "en", "noun"),

	new Word("Métier", "fr", "noun"),
	new Word("Modèle", "fr", "noun", "du"),
	new Word("Model", "en", "noun"),
	
	new Word("Plan", "en", "noun"),
	new Word("Plan", "fr", "noun"),
	new Word("Planning", "en", "noun"),
	new Word("Planification", "fr", "noun"),

	new Word("Quality", "en", "noun"),
	new Word("Qualité", "fr", "noun"),

	new Word("Ressource", "en", "noun"),
	new Word("Ressource", "fr", "noun", "d'"),
	new Word("Ressources", "fr", "noun", "des"),
	new Word("Responsable", "en", "noun"),
	new Word("Responsable", "fr", "noun"),
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
	for (var i = 0; i < text.length; i++) {
		console.log("\nWord for "+text[i].toUpperCase()+", position : "+i);
		// find new word
		var word = dict.getRandomWord(text[i].toUpperCase());
		console.log(word);
		// language logic
		if (userLang == "fr") {
			if(i > 0){
				// add preposition for 2+ word
				result.push(word.preposition + word.value);
			}
			else{
				result.push(word.value);
			}
		}
		else if (userLang == "en") {
			result.push(word.value);
		}
	};
	return result.join(" ");
}
