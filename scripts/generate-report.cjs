const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Executando testes e gerando relatorio...');

const reportPath = path.resolve('./report.json');
const mdPath = path.resolve('./relatorio-testes.md');

// Limpa relatorios anteriores
try { fs.unlinkSync(reportPath); } catch (e) {}
try { fs.unlinkSync(mdPath); } catch (e) {}

// Passo 1: Rodar Vitest com saida JSON
try {
  execSync('npx vitest run --reporter json --outputFile report.json', {
    cwd: path.resolve('./'),
    stdio: 'inherit',
    shell: true
  });
} catch (error) {
  console.log('Alguns testes falharam - gerando relatorio...');
}

// Verifica se o JSON foi gerado
if (!fs.existsSync(reportPath)) {
  console.error('Erro: O arquivo report.json nao foi gerado.');
  process.exit(1);
}

// Passo 2: Ler JSON e montar Markdown
var rawData = fs.readFileSync(reportPath, 'utf8');
var data = JSON.parse(rawData);

var dataHora = new Date(data.startTime).toLocaleString('pt-BR');
var lines = [];

lines.push('# Relatorio de Execucao de Testes');
lines.push('');
lines.push('### Data da Avaliacao: ' + dataHora);
lines.push('');
lines.push('---');
lines.push('');
lines.push('## Resumo Executivo');
lines.push('');
lines.push('Este documento apresenta os resultados da execucao automatizada dos testes do sistema CyberGuard.');
lines.push('');
lines.push('| Status Global | Total de Testes | Passaram | Falharam | Ignorados |');
lines.push('| :--- | :---: | :---: | :---: | :---: |');

var statusGlobal = data.success ? 'APROVADO' : 'REQUER ATENCAO';
lines.push('| ' + statusGlobal + ' | ' + data.numTotalTests + ' | ' + data.numPassedTests + ' | ' + data.numFailedTests + ' | ' + data.numPendingTests + ' |');
lines.push('');
lines.push('---');
lines.push('');
lines.push('## Detalhamento por Componente');
lines.push('');

if (data.testResults && data.testResults.length > 0) {
  for (var i = 0; i < data.testResults.length; i++) {
    var suite = data.testResults[i];
    var suiteName = path.basename(suite.name);
    var suiteStatus = suite.status === 'failed' ? 'Com Erros' : 'Sucesso';

    lines.push('### Arquivo: ' + suiteName + '  [' + suiteStatus + ']');
    lines.push('');

    if (suite.assertionResults && suite.assertionResults.length > 0) {
      for (var j = 0; j < suite.assertionResults.length; j++) {
        var test = suite.assertionResults[j];
        var icone = 'PENDENTE';
        if (test.status === 'passed') icone = 'PASSOU';
        else if (test.status === 'failed') icone = 'FALHOU';

        var describeGroup = '';
        if (test.ancestorTitles && test.ancestorTitles.length > 0) {
          describeGroup = '[' + test.ancestorTitles.join(' >> ') + '] ';
        }

        lines.push('- **' + icone + '** - ' + describeGroup + test.title);

        if (test.status === 'failed' && test.failureMessages && test.failureMessages.length > 0) {
          var msgErro = test.failureMessages[0].substring(0, 200).replace(/\n/g, ' ');
          lines.push('  - Erro: ' + msgErro);
        }
      }
      lines.push('');
    } else {
      lines.push('- Nenhum teste executado neste arquivo.');
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }
} else {
  lines.push('Nenhum resultado de teste encontrado.');
  lines.push('');
}

lines.push('---');
lines.push('');
lines.push('*Documento gerado automaticamente pelo sistema de testes do CyberGuard.*');
lines.push('');

var mdContent = lines.join('\n');
fs.writeFileSync(mdPath, mdContent, 'utf8');

// Remove JSON intermediario
try { fs.unlinkSync(reportPath); } catch (e) {}

console.log('');
console.log('Relatorio gerado com sucesso em: relatorio-testes.md');
console.log('Voce pode abrir este arquivo ou colar o conteudo no Microsoft Word.');
