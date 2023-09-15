#!usr/bin/env deno run

function gravar_musica(
    musicas: number[], cartuchos: number[], n: number, k: number
) {
    // se não há mais musicas ou não há mais cartuchos
    if (n < 0 || k <= 0) return 0;

    // resultado da maior recursão
    let resultado = 0;

    // verifica a recursao para cada cartucho
    for (let i = 0; i <= k; i++) {
        // se a musica não cabe no cartucho passa pro proximo
        if (cartuchos[i] - musicas[n] < 0) continue;

        let novos_cartuchos = [...cartuchos];
        novos_cartuchos[i] -= musicas[n];

        resultado = Math.max(
            resultado,
            musicas[n] + gravar_musica(musicas, novos_cartuchos, n - 1, k)
        );
    }

    return Math.max(
        gravar_musica(musicas, cartuchos, n - 1, k), // nao gravar a musica atual
        resultado                                    // gravar a musica atual
    );
}

function gravar_musica_guloso(
    musicas: number[], cartuchos: number[], n: number, k: number
) {
    // se musicas nao esta ordenado, ordena
    if (!esta_ordenado(musicas))
        musicas.sort(crescente);

    // se cartuchos nao esta ordenado, ordena
    if (!esta_ordenado(cartuchos))
        cartuchos.sort(crescente);

    if (n < 0 || k < 0)
        return 0;

    let i = k;

    for (; i >= 0; i--)
        if (cartuchos[i] >= musicas[n]) break;

    if (i < 0) return gravar_musica_guloso(musicas, cartuchos, n - 1, k);

    // se a musica atual cabe no cartucho
    let novos_cartuchos = [...cartuchos];
    novos_cartuchos[i] -= musicas[n];

    return musicas[n] + gravar_musica_guloso(
        musicas, novos_cartuchos, n - 1, k
    );
}

// main
(() => {
    const musicas = [
        7, 3, 3, 2, 4, 4, 2, 3
    ];
    const cartuchos = [
        9, 8, 9
    ];
    const n = musicas.length - 1;
    const k = cartuchos.length - 1;

    console.log(gravar_musica_guloso(musicas, cartuchos, n, k));
})()

// --funcoes auxiliares---------------------------------------------------------
const crescente = (a: number, b: number) => a - b;

function esta_ordenado(arr: number[]) {
    for (let i = 1; i < arr.length; i++)
        if (arr[i - 1] > arr[i]) return false;

    return true;
}
