function sortAlphabetically(filesAndDirs) {
  return filesAndDirs.slice().sort((a, b) => {
    const nameA = a.toLowerCase();
    const nameB = b.toLowerCase();

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  });
}

export { sortAlphabetically };
