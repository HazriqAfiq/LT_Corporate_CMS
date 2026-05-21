/**
 * Batch restyler: replaces light admin UI patterns with dark gold enterprise theme.
 * Run from project root: node scripts/restyle_admin.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ADMIN_DIR = 'resources/js/Pages/Admin';

const REPLACEMENTS = [
    // Card containers
    [/bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/g, 'bg-[#0c0c0e] rounded-2xl border border-white/5'],
    [/bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden/g, 'bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden'],
    [/bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col/g, 'bg-[#0c0c0e] rounded-2xl border border-white/5 flex flex-col'],
    [/bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col min-h-\[500px\]/g, 'bg-[#0c0c0e] rounded-2xl border border-white/5 flex flex-col min-h-[500px]'],
    [/bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full/g, 'bg-[#0c0c0e] rounded-2xl border border-white/5 flex flex-col h-full'],
    [/bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center/g, 'bg-[#0c0c0e] rounded-2xl border border-white/5 flex items-center'],

    // Section/panel headers
    [/border-b border-gray-100 dark:border-gray-700/g, 'border-b border-white/5'],
    [/border-t border-gray-100 dark:border-gray-700/g, 'border-t border-white/5'],
    [/border border-gray-100 dark:border-gray-700/g, 'border border-white/5'],

    // Heading/label text inside panels
    [/text-lg font-semibold text-gray-900 dark:text-white/g, 'text-base font-bold text-white'],
    [/text-xl font-semibold text-gray-900 dark:text-white/g, 'text-lg font-bold text-white'],
    [/text-sm font-medium text-gray-500 dark:text-gray-400/g, 'text-xs font-medium text-zinc-500 tracking-wider uppercase'],
    [/text-sm font-medium text-gray-700 dark:text-gray-300/g, 'text-sm font-medium text-zinc-300'],
    [/block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1/g, 'block text-xs font-semibold text-zinc-400 mb-1.5 tracking-wider uppercase'],
    [/block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2/g, 'block text-xs font-semibold text-zinc-400 mb-2 tracking-wider uppercase'],
    [/text-sm font-medium text-gray-900 dark:text-white line-clamp-2/g, 'text-sm font-medium text-white line-clamp-2'],
    [/text-gray-900 dark:text-white line-clamp-2/g, 'text-white line-clamp-2'],
    [/text-gray-900 dark:text-white/g, 'text-white'],
    [/text-gray-500 dark:text-gray-400/g, 'text-zinc-500'],
    [/text-gray-500 dark:text-gray-300/g, 'text-zinc-400'],
    [/text-gray-700 dark:text-gray-300/g, 'text-zinc-300'],
    [/text-sm text-gray-500 dark:text-gray-400/g, 'text-sm text-zinc-500'],
    [/text-sm text-gray-700 dark:text-gray-300/g, 'text-sm text-zinc-300'],
    [/text-sm text-gray-600 dark:text-gray-400/g, 'text-sm text-zinc-400'],

    // Form inputs
    [/w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500/g, 'w-full bg-[#080808] border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] placeholder-zinc-600 transition-colors'],
    [/w-full md:w-64 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500/g, 'w-full md:w-64 bg-[#080808] border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] placeholder-zinc-600 transition-colors'],
    [/rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500/g, 'bg-[#080808] border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] placeholder-zinc-600 transition-colors'],

    // Search input
    [/block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors/g, 'block w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors'],

    // Select dropdowns
    [/rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white/g, 'bg-[#080808] border border-white/10 text-white rounded-xl'],

    // Blue primary buttons → gold
    [/inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50/g, 'inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200 disabled:opacity-50'],
    [/inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/g, 'inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200'],
    [/px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none/g, 'px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200 focus:outline-none'],

    // Cancel/secondary buttons
    [/px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500/g, 'px-4 py-2.5 border border-white/10 text-sm font-medium rounded-xl text-zinc-300 bg-white/5 hover:bg-white/10 transition-all duration-200 focus:outline-none'],

    // Create/New button in index pages
    [/inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700/g, 'inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:bg-[var(--gold-light)] transition-all duration-200'],

    // Table header bg
    [/border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider/g, 'border-b border-white/5 text-zinc-500 text-xs font-semibold uppercase tracking-wider'],
    [/bg-gray-50\/50 dark:bg-gray-800\/50 text-gray-500 dark:text-gray-400 text-sm font-semibold/g, 'text-zinc-500 text-xs font-semibold'],

    // Table row dividers
    [/border-b border-gray-100 dark:border-gray-700\/50 last:border-0 hover:bg-gray-50\/50 dark:hover:bg-gray-800\/50 transition-colors/g, 'border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors'],
    [/border-b border-gray-100 dark:border-gray-700 flex justify-between items-center/g, 'border-b border-white/5 flex justify-between items-center'],

    // Pagination active state
    [/bg-blue-600 text-white font-semibold/g, 'bg-[var(--gold)] text-[#080808] font-bold'],
    [/bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/g, 'bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10'],
    [/bg-gray-50 dark:bg-gray-800\/30/g, 'bg-[#080808]/30'],

    // Edit icon hover (blue → gold)
    [/text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors/g, 'text-zinc-500 hover:text-[var(--gold)] transition-colors'],

    // Empty state text
    [/text-center text-gray-500 dark:text-gray-400/g, 'text-center text-zinc-600'],

    // Nav back link
    [/text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center transition-colors/g, 'text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors'],

    // bg-white (remaining standalone)
    [/className="bg-white text-gray-900 rounded-md"/g, 'className="bg-[#080808] text-white rounded-xl"'],

    // Upload drop zone
    [/border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md relative group hover:border-blue-500 transition-colors cursor-pointer/g, 'border-2 border-white/10 border-dashed rounded-xl relative group hover:border-[var(--gold)]/50 transition-colors cursor-pointer'],
    [/h-12 w-12 text-gray-400/g, 'h-12 w-12 text-zinc-600'],
    [/text-sm text-gray-600 dark:text-gray-400/g, 'text-sm text-zinc-400'],
    [/text-blue-600 hover:text-blue-500 focus-within:outline-none/g, 'text-[var(--gold)] hover:text-[var(--gold-light)] focus-within:outline-none'],
    [/text-xs text-gray-500 dark:text-gray-400/g, 'text-xs text-zinc-600'],

    // Checkbox
    [/h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded/g, 'h-4 w-4 accent-[var(--gold)] border-white/10 rounded'],
    [/ml-2 block text-sm text-gray-900 dark:text-gray-300/g, 'ml-2 block text-sm text-zinc-300'],

    // Status badges
    [/bg-emerald-100 text-emerald-800 dark:bg-emerald-900\/30 dark:text-emerald-400/g, 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'],
    [/bg-amber-100 text-amber-800 dark:bg-amber-900\/30 dark:text-amber-400/g, 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20'],
    [/bg-blue-100 text-blue-800 dark:bg-blue-900\/30 dark:text-blue-400/g, 'bg-sky-500/10 text-sky-400 border border-sky-500/20'],
    [/bg-blue-100 text-blue-600 dark:bg-blue-900\/30 dark:text-blue-500 mr-4/g, 'bg-sky-500/10 text-sky-400 mr-4'],
    [/bg-amber-100 text-amber-600 dark:bg-amber-900\/30 dark:text-amber-500 mr-4/g, 'bg-[var(--gold)]/10 text-[var(--gold)] mr-4'],
    [/bg-emerald-100 text-emerald-600 dark:bg-emerald-900\/30 dark:text-emerald-500 mr-4/g, 'bg-emerald-500/10 text-emerald-400 mr-4'],

    // Divide table rows
    [/divide-y divide-gray-200 dark:divide-gray-700/g, 'divide-y divide-white/[0.04]'],

    // Hover row
    [/hover:bg-gray-50 dark:hover:bg-gray-700\/50 transition-colors group/g, 'hover:bg-white/[0.02] transition-colors group'],

    // Thumbnail bg
    [/w-10 h-10 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-600/g, 'w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5'],
    [/w-5 h-5 text-gray-400/g, 'w-5 h-5 text-zinc-600'],
];

function processFile(filePath) {
    let content = readFileSync(filePath, 'utf-8');
    let changed = false;
    for (const [from, to] of REPLACEMENTS) {
        const next = content.replace(from, to);
        if (next !== content) { content = next; changed = true; }
    }
    if (changed) {
        writeFileSync(filePath, content, 'utf-8');
        console.log('✅ Restyled:', filePath);
    } else {
        console.log('⏭  No change:', filePath);
    }
}

function walk(dir) {
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full);
        else if (full.endsWith('.jsx')) processFile(full);
    }
}

walk(ADMIN_DIR);
console.log('\nDone. Run: npm run build');
