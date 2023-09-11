#!usr/bin/env deno run

/** 
 * formulação gulosa do problema 1970
 * --NÃO É OTIMO--
 * 
 * pega sempre a música em que sobra menos tempo em um cartucho
 * ex.: 
 * musicas = 7 2 3 3 4 4 3 2
 * cartuchos = 9 8 9
 * 
 * musica de 7min no cartucho 8min pois sobra 1 minuto
 **/
function gravar_musica(
    musicas: number[], cartuchos: number[], n: number, k: number
) {
    let diferencaMinima = Number.MAX_SAFE_INTEGER;
    let cartI = -1;
    let musI = -1;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < k; j++) {
            let diferenca: number = cartuchos[j] - musicas[i];

            if (diferenca >= 0 && diferenca < diferencaMinima) {
                diferencaMinima = diferenca;
                cartI = j;
                musI = i;

            }
        }
    }
    
    if (cartI < 0 && musI < 0) {
        return 0;
    } else {
        console.log(musicas[musI], musI, "\\", cartuchos[cartI], cartI);
        let duracao = musicas.splice(musI, 1)[0];
        cartuchos[cartI] -= duracao;

        return duracao + gravar_musica(musicas, cartuchos, n - 1, k);
    }
}

// main
(() => {
    const musicas = [
        7, 3, 3, 2, 4, 4, 2, 3
    ];
    const cartuchos = [
        9, 8, 9
    ];
    const n = musicas.length;
    const k = cartuchos.length;

    console.log(gravar_musica(musicas, cartuchos, n, k));
})()    