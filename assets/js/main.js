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
 * @type {Object}
 */
Word.POSITION = {ANYWHERE:0, START:1, MIDDLE:2, END:3};
/**
 * The available subjects for Words.
 * Don't use Word.SUBJECT.ALL, it is automatically added to every created Word.
 * Word.SUBJECT.BULLSHIT isn't a subject but it represents a pool of bullshit words.
 * If no word are found for a given subject, we can search in bullshit to find one.
 * @type {Object}
 */
Word.SUBJECT = {ALL:0, BULLSHIT:1, ASI:2, PLD:3}; 

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
	/**
	 * Contains the words of the dictionnary
	 * It is composed of an arrays and sub-arrays structure.
	 * Structure :
	 * 	word[lang][subject][letter] = [Word, Word, Word, ...]
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
			if(!words[wordToInsert.lang])
				words[wordToInsert.lang] = [];
			for (var i = wordToInsert.subjects.length - 1; i >= 0; i--) {
				// if the subject doesn't exists, create the array
				if(!words[wordToInsert.lang][wordToInsert.subjects[i]])
					words[wordToInsert.lang][wordToInsert.subjects[i]] = [];
				// if the letter doesn't exists, create the array
				if(!words[wordToInsert.lang][wordToInsert.subjects[i]][wordToInsert.first()])
					words[wordToInsert.lang][wordToInsert.subjects[i]][wordToInsert.first()] = [];
				// if the Word isn't already inserted, insert it
				if(!containsWord(words[wordToInsert.lang][wordToInsert.subjects[i]][wordToInsert.first()], wordToInsert))
					words[wordToInsert.lang][wordToInsert.subjects[i]][wordToInsert.first()].push(wordToInsert);
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
			if(	words[wordToRemove.lang]){
				for (var i = wordToRemove.subjects.length - 1; i >= 0; i--) {
					if (words[wordToRemove.lang][wordToRemove.subjects[i]][wordToRemove.first()]
						&& containsWord(words[wordToRemove.lang][wordToRemove.subjects[i]][wordToRemove.first()], wordToRemove)) {
						var wordArray = words[wordToRemove.lang][wordToRemove.subjects[i]][wordToRemove.first()];
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
	 * @param  {String} letter 	The letter that must start the returned Word
	 * @return {Object}         Response Object with 2 attributes:
	 *                                   (boolean)'found', if true, the attribute (Word)'word' exists with the picked Word
	 *                                   				 , if false, the attribute (String)'msg' exists and contains the error message
	 */
	getRandomWord: function(letter, lang, subject){
		if(!words[lang]){
			return {found: false, msg: "There is no word for the language '"+lang+"' available."};
		}
		if (!words[lang][subject]) {
			return {found: false, msg: "There is no word for the subject '"+subject+"' available."};
		}
		if (!words[lang][subject][letter]) {
			return {found: false, msg: "There is no word starting with '"+letter+"' available."};
		}
		else if(words[lang][subject][letter].length == 0){
			return {found: false, msg: "There is not enough words starting with '"+letter+"' available."};
		}
		return {found: true, word: words[lang][subject][letter][getRandomIndex(words[lang][subject][letter].length)]};
	}
};

// TODO : add prefered position, subject, ?
// TODO : Structure the words data somewhere else ?
/**
 * Contains aaaaaaaall the words, as a list. The words aren't indexed here.
 * @type {Array}
 */
var words = [
// A
	new Word("Architecture", "fr", [Word.SUBJECT.ASI], "d'", "noun", Word.POSITION.START),
	new Word("Architecture", "en", [Word.SUBJECT.ASI], "", "noun", Word.POSITION.END),
	new Word("Assurance", "fr", [Word.SUBJECT.PLD], "d'", "noun", Word.POSITION.ANYWHERE),
	new Word("Activité", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "d'"),
	new Word("Activity", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Application", "fr", [Word.SUBJECT.ASI], "d'"),
	new Word("Application", "en", [Word.SUBJECT.ASI]),
	new Word("Applicatif(ve)", "fr", [Word.SUBJECT.ASI], "", "adjective"),
	new Word("Applicative", "en", [Word.SUBJECT.ASI], "", "adjective"),
// B
	new Word("Business", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Bloc", "fr", [Word.SUBJECT.ASI], "en "),
	new Word("Brut(e)", "fr", [Word.SUBJECT.ASI], "", "adjective"),
// C
	new Word("Cas", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "de "),
	new Word("Case", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Conception", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "de "),
	new Word("Comité", "fr", [Word.SUBJECT.PLD], "de "),
	new Word("Conception", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Client", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Customer", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Chain", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Chaîne", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "", "noun", Word.POSITION.START),
// D
	new Word("Détaillé(e)", "fr", [Word.SUBJECT.ASI], "", "adjective"),
	new Word("Development", "en", [Word.SUBJECT.ASI]),
	new Word("Développement", "fr", [Word.SUBJECT.ASI], "de "),
	new Word("Direction", "fr", [Word.SUBJECT.PLD], "de "),
//	new Word("Données", "fr", [Word.SUBJECT.ASI], "des "),
	new Word("Donnée", "fr", [Word.SUBJECT.ASI], "de "),
	new Word("Data", "en", [Word.SUBJECT.ASI]),
	new Word("Diagramme", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "de ", Word.POSITION.START),
	new Word("Diagram", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "", Word.POSITION.END),
	// new Word("Design", "en", "noun"),
// E
	new Word("Economy", "en", [Word.SUBJECT.PLD]),
	new Word("Economie", "fr", [Word.SUBJECT.PLD], "d'"),
	new Word("Employee", "en", [Word.SUBJECT.PLD, Word.SUBJECT.ASI]),
	new Word("Employé", "fr", [Word.SUBJECT.PLD, Word.SUBJECT.ASI], "d'"),
	new Word("Entreprise", "fr", [Word.SUBJECT.PLD, Word.SUBJECT.ASI], "d'"),
	new Word("Enterprise", "en", [Word.SUBJECT.PLD, Word.SUBJECT.ASI]),
	new Word("Environment", "en", [Word.SUBJECT.PLD]),
	new Word("Environnement", "fr", [Word.SUBJECT.PLD], "d'"),
	new Word("Entity", "en", [Word.SUBJECT.ASI]),
	new Word("Entité", "fr", [Word.SUBJECT.ASI], "d'"),
	new Word("Etat", "fr", [Word.SUBJECT.ASI], "d'"),
// F
	new Word("Fonctionnel(le)", "fr", [Word.SUBJECT.PLD, Word.SUBJECT.ASI],"", "adjective"),
	new Word("Fonctional", "en", [Word.SUBJECT.PLD, Word.SUBJECT.ASI],"", "adjective"),
	new Word("Filiale", "fr", [Word.SUBJECT.PLD]),
// G
	new Word("Gestion", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "de "),
// H
	new Word("Hiérarchie", "fr", [Word.SUBJECT.PLD], "de "),
	new Word("Hierarchy", "en", [Word.SUBJECT.PLD]),
// I
	new Word("Interface", "fr", [Word.SUBJECT.ASI], "d'", "noun", Word.POSITION.START),
	new Word("Interface", "en", [Word.SUBJECT.ASI], "", "noun", Word.POSITION.END),
	new Word("Infrastructure", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "d'", "noun"),
	new Word("Infrastructure", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "", "noun"),
// J
// K
// L
	new Word("Local(e)", "fr", [Word.SUBJECT.ASI], "", "adjective"),
	new Word("Local", "en", [Word.SUBJECT.ASI], "", "adjective"),
	new Word("Logique", "fr", [Word.SUBJECT.ASI], "", "adjective"),
	new Word("Logic", "en", [Word.SUBJECT.ASI], "", "adjective"),
	new Word("Leadership", "en", [Word.SUBJECT.PLD]),
// M
	new Word("Management", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "", "noun", Word.POSITION.END),
	new Word("Maîtrise", "fr", [Word.SUBJECT.PLD], "de ", "noun", Word.POSITION.START),
	new Word("Marge", "fr", [Word.SUBJECT.PLD], "de ", "noun", Word.POSITION.START),
	new Word("Métier", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Method", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "", "noun", Word.POSITION.END),
	new Word("Méthode", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "", "noun", Word.POSITION.START),
	new Word("Modèle", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "du "),
	new Word("Model", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
// N
	new Word("Natif(ve)", "fr", [Word.SUBJECT.BULLSHIT], "", "adjective"),
	new Word("Native", "en", [Word.SUBJECT.BULLSHIT], "", "adjective"),
// O
	new Word("Objet", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "d'"),
	new Word("Object", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Orienté(e)", "fr", [Word.SUBJECT.ASI], "", "adjective"),
	new Word("Oriented", "en", [Word.SUBJECT.ASI], "", "adjective"),
// P	
	new Word("Plan", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Plan", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Planning", "en", [Word.SUBJECT.PLD, Word.SUBJECT.ASI]),
	new Word("Planification", "fr", [Word.SUBJECT.PLD, Word.SUBJECT.ASI]),
	new Word("Process", "en", [Word.SUBJECT.PLD, Word.SUBJECT.ASI]),
	new Word("Processus", "fr", [Word.SUBJECT.PLD, Word.SUBJECT.ASI], "de "),
// Q
	new Word("Quality", "en", [Word.SUBJECT.PLD]),
	new Word("Qualité", "fr", [Word.SUBJECT.PLD]),
// R
	new Word("Relationship", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Relation", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "de la "),
	new Word("Resource", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Ressource", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "de "),
	new Word("Ressources", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "des "),
//	new Word("Ressources", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Responsable", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "", "noun", Word.POSITION.START),
// S
	new Word("Service", "en", [Word.SUBJECT.ASI]),
	new Word("Service", "fr", [Word.SUBJECT.ASI]),
	new Word("Séquence", "fr", [Word.SUBJECT.ASI], "de "),
	new Word("Sequence", "en", [Word.SUBJECT.ASI]),
	new Word("Système", "fr", [Word.SUBJECT.ASI]),
	new Word("System", "en", [Word.SUBJECT.ASI]),
	new Word("State", "en", [Word.SUBJECT.ASI]),
	new Word("Supply", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
// T
	new Word("Transaction", "fr", [Word.SUBJECT.PLD], "de "),
// U
	new Word("Utilisation", "fr", [Word.SUBJECT.ASI, Word.SUBJECT.PLD], "d'"),
	new Word("Use", "en", [Word.SUBJECT.ASI, Word.SUBJECT.PLD]),
	new Word("Urbanisme", "fr", [Word.SUBJECT.ASI], "d'"),
	new Word("Urbanism", "en", [Word.SUBJECT.ASI]),
	new Word("Urbanisation", "fr", [Word.SUBJECT.ASI], "d'", "adjective"),
	new Word("Urbanisation", "en", [Word.SUBJECT.ASI], "adjective"),
// V

// W
	new Word("Web", "fr", [Word.SUBJECT.ASI], "du "),
	new Word("Web", "en", [Word.SUBJECT.ASI]),
// X
// Y
// Z
];
 




// Indexation
for (var i = words.length - 1; i >= 0; i--) {
	dict.insert(words[i]);
};


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
	var result = [];
	var removedWords = [];
	for (var i = 0; i < text.length; i++) {
		console.log("\nWord for "+text[i].toUpperCase()+", position : "+i+', lang : '+lang+', subject : '+subject);

		// find new word
		var response = dict.getRandomWord(text[i].toUpperCase(), lang, subject);
		if(response.found == false){
			console.log("Word not found ...");
			if(subject == Word.SUBJECT.ALL){
				alert(response.msg);
				result = [];
				break;	
			}
			// if we can't find the word, search it in bullshit
			console.log("\nWord for "+text[i].toUpperCase()+", position : "+i+', lang : '+lang+', subject : '+Word.SUBJECT.BULLSHIT);
			response = dict.getRandomWord(text[i].toUpperCase(), lang, Word.SUBJECT.BULLSHIT);
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


		// language logic
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
