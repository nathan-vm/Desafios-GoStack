const formatValue = (value: number): string =>
  Intl.NumberFormat('py-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value); // TODO

export default formatValue;
