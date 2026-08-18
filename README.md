# Apply: painel

Interface de operação do [apply-service](https://github.com/icaroMelo1/apply-service), onde
as vagas localizadas, as candidaturas enviadas e as pendências que exigem decisão humana
ficam visíveis.

## Descrição

Apresenta o funil do período, com o número de vagas localizadas, pontuadas, enviadas e
respondidas, e destaca as pendências que exigem intervenção: candidatura interrompida em
formulário, etapa com prazo definido e resposta a revisar antes do envio.

## Motivação

O serviço executa de forma autônoma em ciclos agendados. Sem interface, a única forma de
acompanhar o resultado era a leitura de registros, formato inadequado para as decisões que
o processo exige.

## Stack

Nuxt 4, Vue 3, Quasar, TypeScript
