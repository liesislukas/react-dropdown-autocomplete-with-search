import liquidMetal from 'utils/liquidMetal';

export default function ({input, query}) {
  if (!input || !input.length || !input.filter || !query) {
    return input;
  }
  let filtered = input.filter((x) => liquidMetal.score(x, query) !== 0);

  return filtered.sort((a, b) => {
    let resA = liquidMetal.score(a, query);
    let resB = liquidMetal.score(b, query);
    if (resA < resB) {
      return 1;
    } else if (resA > resB) {
      return -1;
    }
    return 0;
  });
}
