import {Knex} from "knex";

export async function up(knex: Knex ){ //passa qual o formato da váriavel para ter acesso aos recursos pelo knex.
    //criar a tabela
    return knex.schema.createTable('users', table =>{
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('senha').notNullable();       
    });
}

export async function down(knex: Knex){
    //voltar atrás, deletar a tabela
   return knex.schema.dropTable('users');
}