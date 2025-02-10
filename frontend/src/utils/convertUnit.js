export function byteToMegabyte(bytes) {
    // 1 Megabyte binário = 1024 * 1024 bytes
    const megabytesBinario = bytes / (1024 * 1024);
    
    // Retorna o valor com duas casas decimais
    return megabytesBinario.toFixed(2);
}