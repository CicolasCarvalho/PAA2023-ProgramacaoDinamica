#!usr/bin/env deno run

/*! beecrowd
//@ts-ignore
import * as fs from 'node:fs';
let input = fs.readFileSync("/dev/stdin", "utf8");
*/
let input =
`6
10
15 5
23 4
21 2
16 4
19 5
18 2
2
15
47 12
39 4
5
23
43 9
4 1
17 2
13 5
54 17
6
7
14 4
21 2
26 7
18 4
30 13
10 2
0`;

type entrega = {tempo: number, quantidade: number};

function entrega_pizza(
    entregas: entrega[], n: number, capacidade: number
) {
    if (n < 0 || capacidade === 0) return 0;

    if (capacidade < entregas[n].quantidade)
        return entrega_pizza(entregas, n - 1, capacidade);

    return Math.max(
        entregas[n].tempo + entrega_pizza(
            entregas, n - 1, capacidade - entregas[n].quantidade
        ),
        entrega_pizza(entregas, n - 1, capacidade)
    )
}

//@ts-ignore
const memo: number[][] = [];

function entrega_pizza_dinamico(
    entregas: entrega[], n: number, capacidade: number
) {
    if (n < 0 || capacidade === 0) return 0;

    if (memo[n][capacidade] >= 0)
        return memo[n][capacidade];

    let resultado = 0;

    if (capacidade < entregas[n].quantidade) {
        resultado = entrega_pizza_dinamico(entregas, n - 1, capacidade);
    } else {
        resultado = Math.max(
            entregas[n].tempo + entrega_pizza_dinamico(
                entregas, n - 1, capacidade - entregas[n].quantidade
            ),
            entrega_pizza_dinamico(entregas, n - 1, capacidade)
        );
    }

    memo[n][capacidade] = resultado;
    return resultado;
}

function entrega_pizza_guloso(
    entregas: entrega[], n: number, capacidade: number
) {
    let i = n;
    for (; i >= 0; i--)
        // se cabe na capacidade atual
        if (capacidade > entregas[i].quantidade) break;

    // se nenhum cabe retorna 0
    if (i < 0) return 0;

    return (
        entregas[i].tempo + entrega_pizza_guloso(
            entregas, i - 1, capacidade - entregas[i].quantidade
        )
    );
}

(() => {
    const linhas = input.split("\n");

    const pizzas: entrega[] = [];

    while (linhas[0] != "0") {
        const pedidos = +(linhas.shift()??"");
        const capacidade = +(linhas.shift()??"");

        pizzas.length = 0;

        for (let i = 0; i < pedidos; i++) {
            const [t, q] = (linhas.shift()??"").split(" ");

            pizzas.push({tempo: +t, quantidade: +q});
        }

        inicializar_memo(pedidos - 1, capacidade);
        console.log(entrega_pizza_dinamico(pizzas, pedidos - 1, capacidade) + " min.");
        // pizzas.sort((a, b) => a.tempo - b.tempo);
        // console.time('guloso');
        // console.log(entrega_pizza_guloso(pizzas, pedidos - 1, capacidade));
        // console.timeEnd('guloso');

        // console.time('recursivo');
        // console.log(entrega_pizza(pizzas, pedidos - 1, capacidade));
        // console.timeEnd('recursivo');

        // console.time('dinamico');
        // console.log(entrega_pizza_dinamico(pizzas, pedidos - 1, capacidade));
        // console.timeEnd('dinamico');
    }
})()

//@ts-ignore
function inicializar_memo(n: number, capacidade: number) {
    for (let i = 0; i <= n; i++) {
        memo[i] = [];

        for (let j = 0; j <= capacidade; j++) {
            memo[i][j] = -1;
        }
    }
}