# Apply — painel

Painel de operação do [apply-service](https://github.com/icaroMelo1/apply-service): a
interface onde as vagas encontradas, as candidaturas enviadas e as que exigem decisão
humana ficam visíveis.

## O que faz

Mostra o funil do dia — quantas vagas foram encontradas, pontuadas, enviadas e quantas
tiveram resposta — e separa o que trava e precisa de mim: candidatura que parou num
formulário, etapa com prazo, resposta a revisar antes de enviar.

## Por que existe separado

O serviço roda sozinho em ciclos agendados. Sem uma tela, a única forma de saber o que ele
fez era ler log — e a decisão que importa ("isto aqui eu respondo, isto aqui descarto")
não cabe em log.

## Stack

Nuxt 4 · Vue 3 · Quasar · TypeScript
