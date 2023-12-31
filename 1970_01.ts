#!usr/bin/env deno run

/*! beecrowd
//@ts-ignore
import * as fs from 'node:fs';
let input = fs.readFileSync("/dev/stdin", "utf8");
*/
//@ts-ignore
let input = 
`8 3
7 3 3 2 4 4 2 3
9 8 9`;

function gravar_musica(
    musicas: number[], cartuchos: number[], n: number, k: number
): number {
    // se não há mais musicas ou não há mais cartuchos
    if (n < 0 || k <= 0) return 0;

    // resultado da maior recursão
    let resultado = 0;

    // verifica a recursao para cada cartucho
    for (let i = 0; i < k; i++) {
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

//@ts-ignore
const memo: number[][][][] = [];

function gravar_musica_dinamico(
    musicas: number[], cartuchos: number[], n: number, k: number
) {
    // se não há mais musicas ou não há cartuchos
    if (n < 0 || k <= 0) return 0;

    let x = cartuchos[0]??0;    // caso não esteja definido use 0 para x
    let y = cartuchos[1]??0;    // caso não esteja definido use 0 para y
    let z = cartuchos[2]??0;    // caso não esteja definido use 0 para z
    if (memo[n][x][y][z] != -1)
        return memo[n][x][y][z];

    // se não há memo registrado

    // resultado da maior recursão
    let resultado = 0;

    // verifica a recursao para cada cartucho
    for (let i = 0; i < k; i++) {
        // se a musica não cabe no cartucho passa pro proximo
        if (cartuchos[i] - musicas[n] < 0) continue;

        let novos_cartuchos = [...cartuchos];
        novos_cartuchos[i] -= musicas[n];

        resultado = Math.max(
            resultado,
            musicas[n] + gravar_musica_dinamico(musicas, novos_cartuchos, n - 1, k)
        );
    }

    memo[n][x][y][z] = Math.max(
        gravar_musica_dinamico(musicas, cartuchos, n - 1, k),   // nao gravar a musica atual
        resultado                                               // gravar a musica atual
    );

    return memo[n][x][y][z];
}

function gravar_musica_guloso(
    musicas: number[], cartuchos: number[], n: number, k: number
): number {
    if (n < 0)
        return 0;

    let i = k;

    for (; i >= 0; i--)
        if (cartuchos[i] >= musicas[n]) break;

    if (i < 0) return gravar_musica_guloso(musicas, cartuchos, n - 1, k);

    // se a musica atual cabe no cartucho
    let novos_cartuchos = [...cartuchos];
    novos_cartuchos[i] -= musicas[n];

    while (i > 0 && novos_cartuchos[i] < novos_cartuchos[i - 1]) {
        let aux = novos_cartuchos[i];
        novos_cartuchos[i] = novos_cartuchos[i - 1];
        novos_cartuchos[i - 1] = aux;
        i--;
    }

    return musicas[n] + gravar_musica_guloso(
        musicas, novos_cartuchos, n - 1, k
    );
}

// main
(() => {
    let lines: string[] = input.split("\n");

    let str = lines.shift()??"0 0";
    let [n, k] = str.split(" ").map((val) => +val);

    str = lines.shift()??"";
    const musicas: number[] = str?.split(" ").map((val) => +val);

    str = lines.shift()??"";
    const cartuchos: number[] = str?.split(" ").map((val) => +val);

    musicas.sort(crescente);
    cartuchos.sort(crescente);

    console.time('guloso');
    console.log(gravar_musica_guloso(musicas, cartuchos, n, k));
    console.timeEnd('guloso');

    console.time('recursivo');
    console.log(gravar_musica(musicas, cartuchos, n, k));
    console.timeEnd('recursivo');

    inicializar_memo(cartuchos, n, k);
    console.time('dinamico');
    console.log(gravar_musica_dinamico(musicas, cartuchos, n, k));
    console.timeEnd('dinamico');
})()

// --funcoes auxiliares---------------------------------------------------------
function crescente (a: number, b: number) {
    return a - b;
}

function esta_ordenado(arr: number[]) {
    for (let i = 1; i < arr.length; i++)
        if (arr[i - 1] > arr[i]) return false;

    return true;
}

//@ts-ignore
function inicializar_memo(cartuchos: number[], n: number, k: number) {
    // gerar todos os memos
    // lembrado que k sempre é <= 3
    for (let x = 0; x <= n; x++) {
        memo[x] = [];

        if (k == 0) {
            //@ts-ignore
            memo[x][0] = [];
            memo[x][0][0] = [];
            memo[x][0][0][0] = -1;
            continue;
        }

        for (let y = 0; y <= cartuchos[0]; y++) {
            //@ts-ignore
            memo[x][y] = [];

            if (k == 1) {
                memo[x][y][0] = [];
                memo[x][y][0][0] = -1;
                continue;
            }

            for (let z = 0; z <= cartuchos[1]; z++) {
                memo[x][y][z] = [];

                if (k == 2) {
                    memo[x][y][z][0] = -1;
                    continue;
                }

                for (let w = 0; w <= cartuchos[2]; w++)
                    memo[x][y][z][w] = -1;
            }
        }
    }
}