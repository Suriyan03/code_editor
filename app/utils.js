// Logic to automatically fix common code mistakes
export const autoFixCode = (code) => {
  const lines = code.split('\n');
  
  const fixedLines = lines.map(line => {
    let content = line.trim(); // 1. Remove extra spaces
    if (!content) return '';

    // 2. Add missing semicolons (basic rule)
    // Don't add if it ends with { or } or already has ;
    if (!content.endsWith(';') && !content.endsWith('{') && !content.endsWith('}')) {
      content += ';';
    }
    
    return content;
  });

  // 3. Fix Bracket Balancing (Close unclosed brackets)
  let openBrackets = (code.match(/{/g) || []).length;
  let closeBrackets = (code.match(/}/g) || []).length;
  
  while (openBrackets > closeBrackets) {
    fixedLines.push('}');
    closeBrackets++;
  }

  // 4. Apply indentation (2 spaces)
  return fixedLines.map(line => {
      if(line.startsWith('}')) return line; // Closing brackets usually go on their own line
      return `  ${line}`;
  }).join('\n');
};

// Logic for the Help Chatbot
export const getHelpResponse = (query) => {
  const q = query.toLowerCase();
  
  if (q.includes('loop') || q.includes('for') || q.includes('while')) {
    return "Tip: Use a 'for' loop to repeat code: for(let i=0; i<5; i++) { ... }";
  }
  if (q.includes('variable') || q.includes('const') || q.includes('let')) {
    return "Tip: Use 'const' for values that don't change, and 'let' for values that do.";
  }
  if (q.includes('function')) {
    return "Tip: Define functions like this: const myFunc = () => { ... }";
  }
  if (q.includes('print') || q.includes('log')) {
    return "Tip: Use 'console.log(\"message\")' to output text.";
  }
  
  return "I'm not sure about that. Try asking about 'loops', 'variables', or 'functions'.";
};