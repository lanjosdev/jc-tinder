export function arraysHaveSameValues(arr1, arr2, keepOrder=false ) {
    // Verifica o comprimento
    if(arr1.length !== arr2.length) return false;
    
  
    // Cria cópias ordenadas para não alterar as originais (caso a ordem não importe)
    if(!keepOrder) {
        const sortedArr1 = [...arr1].sort();
        const sortedArr2 = [...arr2].sort();

        // retorno quando a ordem não importa (compara cada elemento)
        return sortedArr1.every((value, index) => value === sortedArr2[index]);
    }
  
    // Retorno quando a ordem é importante (compara cada elemento)
    return arr1.every((value, index) => value === arr2[index]);
}