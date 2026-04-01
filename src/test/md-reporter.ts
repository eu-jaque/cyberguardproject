import type { Reporter, File, Task } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Reporter customizado que gera um relatório .md na mesma pasta
 * de cada arquivo de teste, sempre que os testes são executados.
 */
export default class MarkdownReporter implements Reporter {
  onFinished(files: File[] = []) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR');
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);

    // Também gera um relatório consolidado na pasta report/
    const reportDir = path.resolve(process.cwd(), 'report');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    let consolidatedContent = `# 📊 Relatório Consolidado de Testes\n\n`;
    consolidatedContent += `- **Data/Hora:** ${dateStr} às ${timeStr}\n`;
    consolidatedContent += `- **Arquivos testados:** ${files.length}\n\n`;
    consolidatedContent += `---\n\n`;

    for (const file of files) {
      const testDir = path.dirname(path.resolve(process.cwd(), file.filepath));
      const testBaseName = path.basename(file.filepath, path.extname(file.filepath));

      // Coleta todas as tasks recursivamente (suporta describe aninhados)
      const allTasks = this.collectTasks(file.tasks);

      const passed = allTasks.filter(t => t.result?.state === 'pass');
      const failed = allTasks.filter(t => t.result?.state === 'fail');
      const skipped = allTasks.filter(t => t.result?.state === 'skip' || t.mode === 'skip');
      const total = allTasks.length;

      const status = failed.length === 0 ? '✅ APROVADO' : '❌ REPROVADO';

      // ──── Monta o conteúdo do relatório individual ────
      let content = `# 📋 Relatório de Teste — ${testBaseName}\n\n`;
      content += `> Gerado automaticamente em **${dateStr}** às **${timeStr}**\n\n`;
      content += `## 📝 Resumo\n\n`;
      content += `| Métrica | Valor |\n`;
      content += `|---|---|\n`;
      content += `| **Total de Testes** | ${total} |\n`;
      content += `| **✅ Sucessos** | ${passed.length} |\n`;
      content += `| **❌ Falhas** | ${failed.length} |\n`;
      content += `| **⏭️ Pulados** | ${skipped.length} |\n`;
      content += `| **Status Final** | ${status} |\n\n`;

      // Tabela detalhada de casos de teste
      content += `## 📑 Detalhes dos Casos de Teste\n\n`;
      content += `| # | Cenário | Status | Duração | Observação |\n`;
      content += `|:---:|---|:---:|:---:|---|\n`;

      allTasks.forEach((task, index) => {
        const state = task.result?.state;
        const duration = task.result?.duration != null ? `${task.result.duration.toFixed(0)}ms` : '-';
        let statusIcon = '⏭️ Pulado';
        let observation = '-';

        if (state === 'pass') {
          statusIcon = '✅ Passou';
          observation = 'Comportamento conforme esperado';
        } else if (state === 'fail') {
          statusIcon = '❌ Falhou';
          const errorMsg = task.result?.errors?.[0]?.message || 'Erro desconhecido';
          // Limpa caracteres que podem quebrar a tabela markdown
          observation = errorMsg.replace(/\|/g, '\\|').replace(/\n/g, ' ').substring(0, 200);
        }

        content += `| ${index + 1} | ${task.name} | ${statusIcon} | ${duration} | ${observation} |\n`;
      });

      content += `\n`;

      // Seção de bugs encontrados
      content += `## 🐛 Bugs Encontrados\n\n`;
      if (failed.length > 0) {
        failed.forEach(task => {
          content += `### ❌ ${task.name}\n\n`;
          content += `\`\`\`\n`;
          content += `${task.result?.errors?.[0]?.message || 'Erro desconhecido'}\n`;
          content += `\`\`\`\n\n`;
        });
      } else {
        content += `✨ Nenhum bug identificado durante esta execução.\n\n`;
      }

      // Resultado final
      content += `---\n\n`;
      content += `## 🏁 Resultado Final: ${status}\n`;

      // Salva o relatório na mesma pasta do teste
      const reportFileName = `Relatorio_${testBaseName}_${timestamp}.md`;
      const reportPath = path.join(testDir, reportFileName);
      fs.writeFileSync(reportPath, content, 'utf8');
      console.log(`\n📄 Relatório gerado: ${reportPath}`);

      // Adiciona ao consolidado
      consolidatedContent += content;
      consolidatedContent += `\n---\n\n`;
    }

    // Salva relatório consolidado na pasta report/
    const consolidatedPath = path.join(reportDir, `relatorio_${timestamp}.md`);
    fs.writeFileSync(consolidatedPath, consolidatedContent, 'utf8');
    console.log(`\n🚀 Relatório consolidado gerado: ${consolidatedPath}\n`);
  }

  /**
   * Coleta recursivamente todas as tasks (testes individuais)
   * dentro de describes aninhados.
   */
  private collectTasks(tasks: Task[]): Task[] {
    const result: Task[] = [];
    for (const task of tasks) {
      if (task.type === 'suite' && 'tasks' in task) {
        result.push(...this.collectTasks((task as any).tasks));
      } else {
        result.push(task);
      }
    }
    return result;
  }
}
