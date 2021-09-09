//SEEDS -> PRE CADASTRAR DADOS NO BANCO DE DADOS. JA VIR COM ESSAS INFO

import { Knex } from "knex";

export async function seed(knex: Knex){
    await knex('items').insert([
        {title: 'Revisão dos Componentes', image: 'componentes.png'},
        {title: "Troca de oléo e filtros", image: "oleo_filtros.png"},
        {title: "Troca de lâmpadas", image: "lampadas.png"},
        {title: "Alinhamento e Balanceamento", image: "ali_bal.png"},
        {title: "Pintura e Polimento", image: "pint_poli.png"},
        {title: "Ar Condicionado", image: "ar_cond.png"},
    ]);
}