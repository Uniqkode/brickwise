export function createReview(sample, id) {
  return {...sample, id, sources:sample.sources.map(source => ({...source})), findings:sample.findings.map(finding => ({...finding})), mode:'sample', accepted:false, checked:sample.findings.map(() => false), visited:[], notes:''};
}

const isChecked = (report, index) => Array.isArray(report.checked) && report.checked[index] === true && Array.isArray(report.visited) && report.visited.includes(report.findings[index].source);

export function reviewProgress(report) {
  const total = report.findings.length;
  const checked = report.findings.filter((_, index) => isChecked(report, index)).length;
  return {total, checked, fraction:total ? checked / total : 0, canQueue:total > 0 && checked === total && !report.accepted};
}

export function reportToMarkdown(report, name, scope) {
  return `# ${name} — ${report.title}\n\nMode: ${report.mode === 'live' ? 'Connected AI service' : 'Prepared sample report'}\nStatus: ${report.accepted ? 'Queued for human review' : 'Draft — not queued'}\n\n${report.summary}\n\n` +
    report.findings.map((finding, index) => `## ${index + 1}. ${finding.title}\n\nEvidence checked: ${isChecked(report, index) ? 'Yes' : 'No'}\nSource: ${finding.source}\n> ${finding.quote}\n\nNext action: ${finding.action}\n`).join('\n') +
    (report.notes ? `\n## Reviewer note\n\n${report.notes}\n` : '') +
    '\n## Source material\n\n' + report.sources.map(source => `### ${source.id}: ${source.name}\n\n${source.excerpt}\n`).join('\n') +
    `\n## Scope\n\n${scope}\n\nPrepared examples and the illustrative sample image are demonstration material. A qualified professional verifies the condition and approves the work.\n`;
}
