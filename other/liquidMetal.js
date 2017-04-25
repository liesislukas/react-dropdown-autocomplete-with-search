(function (global) {
  let SCORE_NO_MATCH = 0.0;
  let SCORE_MATCH = 1.0;
  let SCORE_TRAILING = 0.8;
  let SCORE_TRAILING_BUT_STARTED = 0.9;
  let SCORE_BUFFER = 0.85;
  let WORD_SEPARATORS = ' \t_-';

  let LiquidMetal = {
    lastScore: null,
    lastScoreArray: null,

    score: function (string, abbrev) {
      // short circuits
      if (abbrev.length === 0) return SCORE_TRAILING;
      if (abbrev.length > string.length) return SCORE_NO_MATCH;

      // match & score all
      let allScores = [];
      let search = string.toLowerCase();
      abbrev = abbrev.toLowerCase();
      this._scoreAll(string, search, abbrev, -1, 0, [], allScores);

      // complete miss
      if (allScores.length == 0) return 0;

      // sum per-character scores into overall scores,
      // selecting the maximum score
      let maxScore = 0.0, maxArray = [];
      let maxSequence = 0;
      for (let i = 0; i < allScores.length; i++) {
        // console.log('hey: ', allScores[i]);
        let scores = allScores[i];
        let scoreSum = 0.0;
        let currentSequence = 0;
        for (let j = 0; j < string.length; j++) {
          scoreSum += scores[j];
          if (scores[j] === 1) {
            currentSequence++;
          } else {
            currentSequence = 0;
          }
          if (currentSequence > maxSequence) {
            maxSequence = currentSequence;
          }
        }
        if (scoreSum > maxScore) {
          maxScore = scoreSum;
          maxArray = scores;
        }
      }

      // normalize max score by string length
      // s. t. the perfect match score = 1
      // console.log('#ldfkls maxScore: ', maxScore, 'maxSequence: ', maxSequence);

      // maxScore +=(maxSequence*2);
      maxScore /= string.length;
      maxSequence /= string.length;

      // maxScore+=maxSequence*20;
      maxScore = maxScore + maxSequence;
      // console.log('#ldfkls maxScore: ', maxScore, 'maxSequence: ', maxSequence);

      // add extra 100% points for each first letters match

      let howManyFirstLettersMatch = 0;

      let longest = abbrev.length > search.length ? abbrev.length : search.length;
      let sequence = true;
      for (let i = 0; i < longest; i++) {
        if (sequence && abbrev[i] === search[i]) {
          howManyFirstLettersMatch++;
        } else {
          sequence = false;
        }
      }

      if (howManyFirstLettersMatch > 0) {
        // add extra 100% points for matches in front
        maxScore = maxScore * (howManyFirstLettersMatch + 1);
      }

      // add extra 35% points if last letters match
      if (abbrev[abbrev.length - 1] === search[search.length - 1]) {
        maxScore = maxScore * 1.35;
      }

      // record maximum score & score array, return
      this.lastScore = maxScore;
      this.lastScoreArray = maxArray;
      return maxScore;
    },

    _scoreAll: function (string, search, abbrev, searchIndex, abbrIndex, scores, allScores) {
      // console.log('search: ', string, search, abbrev, searchIndex, abbrIndex, scores, allScores);
      // save completed match scores at end of search
      if (abbrIndex == abbrev.length) {
        // add trailing score for the remainder of the match
        let started = (search.charAt(0) == abbrev.charAt(0));
        let trailScore = started ? SCORE_TRAILING_BUT_STARTED : SCORE_TRAILING;
        fillArray(scores, trailScore, scores.length, string.length);
        // save score clone (since reference is persisted in scores)
        allScores.push(scores.slice(0));
        return;
      }

      // consume current char to match
      let c = abbrev.charAt(abbrIndex);
      abbrIndex++;

      // cancel match if a character is missing
      let index = search.indexOf(c, searchIndex);
      if (index == -1) return;

      // match all instances of the abbreviaton char
      let scoreIndex = searchIndex; // score section to update
      while ((index = search.indexOf(c, searchIndex + 1)) != -1) {
        // score this match according to context
        if (isNewWord(string, index)) {
          scores[index - 1] = 1;
          fillArray(scores, SCORE_BUFFER, scoreIndex + 1, index - 1);
        }
        else if (isUpperCase(string, index)) {
          fillArray(scores, SCORE_BUFFER, scoreIndex + 1, index);
        }
        else {
          fillArray(scores, SCORE_NO_MATCH, scoreIndex + 1, index);
        }
        scores[index] = SCORE_MATCH;

        // consume matched string and continue search
        searchIndex = index;
        this._scoreAll(string, search, abbrev, searchIndex, abbrIndex, scores, allScores);
      }
    }
  };

  function isUpperCase(string, index) {
    let c = string.charAt(index);
    return ('A' <= c && c <= 'Z');
  }

  function isNewWord(string, index) {
    let c = string.charAt(index - 1);
    return (WORD_SEPARATORS.indexOf(c) != -1);
  }

  function fillArray(array, value, from, to) {
    for (let i = from; i < to; i++) {
      array[i] = value;
    }
    return array;
  }

  // Export as AMD...
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return LiquidMetal;
    });
  }

  // ...or as a node module
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = LiquidMetal;
  }

  else {
    global.LiquidMetal = LiquidMetal;
  }
})(typeof window !== 'undefined' ? window : this);
