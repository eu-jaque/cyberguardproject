import fs from 'node:fs';

export default class MarkdownReporter {
  onFinished(files) {
      let passed = 0;
      let failed = 0;
      let skipped = 0;

      let md = `# Relatório Final de Testes: Formulário de Contatos\n\n`;
      md += `> **Gerado Automaticamente** após execução do último \`npm run test\`\n\n`;

      md += `## 1. Escopo e Ferramentas\n`;
      md += `- **Framework de Asserção:** Vitest\n`;
      md += `- **Ferramenta de DOM:** React Testing Library\n\n`;

      md += `## 2. Cenários Validados e Resultados\n\n`;

      files?.forEach((file) => {
          file.tasks?.forEach((task) => {
              if (task.type === 'suite') {
                 task.tasks.forEach(t => {
                     let statusStr = '';
                     if(t.result?.state === 'pass') { statusStr = '✅ **PASSOU**'; passed++; }
                     else if(t.result?.state === 'fail') { statusStr = '❌ **FALHOU**'; failed++; }
                     else { statusStr = '⚠️ **IGNORADO/SKIPPED**'; skipped++; }
                     
                     md += `- **${t.name}**: ${statusStr}\n`;
                     if(t.result?.errors) {
                         t.result.errors.forEach(err => {
                             md += `  - *Erro: ${err.message?.split('\n')[0]}*\n`;
                         });
                     }
                 });
              } else if (task.type === 'test') {
                 let statusStr = '';
                 if(task.result?.state === 'pass') { statusStr = '✅ **PASSOU**'; passed++; }
                     else if(task.result?.state === 'fail') { statusStr = '❌ **FALHOU**'; failed++; }
                     else { statusStr = '⚠️ **IGNORADO/SKIPPED**'; skipped++; }
                 md += `- **${task.name}**: ${statusStr}\n`;
              }
          });
      });

      md += `\n## 3. Resumo da Execução\n`;
      md += `- **Total de Testes:** ${passed + failed + skipped}\n`;
      md += `- **Sucesso:** ${passed}\n`;
      md += `- **Falhas:** ${failed}\n\n`;
      
      let resultadoFinal = failed === 0 ? "🚀 **APROVADO (PRONTO PARA PROD)**" : "⚠️ **REPROVADO (NECESSÁRIA REVISÃO)**";
      md += `**Status Final da Suíte de Código:** ${resultadoFinal}\n`;

      if (!fs.existsSync('./reports')) {
          fs.mkdirSync('./reports', { recursive: true });
      }
      fs.writeFileSync('./reports/relatorio_testes_formulario_contato.md', md, 'utf-8');
      console.log("\n[Custom Reporter] -> Relatório 'relatorio_testes_formulario_contato.md' gerado com sucesso (salvo dentro da pasta /reports)!\n");
  }
}
