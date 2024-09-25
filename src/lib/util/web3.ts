export function shortAddress(address: string, len: number = 17) {
  if (!address) {
    return '';
  }
  if (address.length < 13) {
    return address;
  }
  const a = len - 3;
  const b = ~~(a / 2);
  const c = a - b;
	return address.substring(0, b === c ? b -1 : b) + '...' + address.slice(-(b === c ? c + 1 : c));
}
