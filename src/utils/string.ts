export function addSpacesToSpacelessTitle(title: string) {
  return title.replace(/([A-Z&]|(?:and(?=[A-Z])))/g, " $1").trimLeft();
}
