export const CODE_SNIPPETS = [
  {
    title: "Recursive Directory Builder",
    language: "typescript",
    description: "A high-performance file system walker that structures complex JSON into nested folders.",
    code: `async function buildDir(parent: string, tree: Node) {\n  for (const [name, value] of Object.entries(tree)) {\n    const path = join(parent, name);\n    if (typeof value === 'object') {\n      await fs.mkdir(path);\n      await buildDir(path, value);\n    } else {\n      await fs.writeFile(path, value);\n    }\n  }\n}`
  },
  {
    title: "Date-time Recurrence Algorithm",
    language: "javascript",
    description: "Solving the 'Last Day of Month' edge case for subscription billing cycles.",
    code: `const getNextOccurrence = (baseDate, interval) => {\n  const date = new Date(baseDate);\n  date.setMonth(date.getMonth() + interval);\n  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();\n  if (baseDate.getDate() > lastDay) {\n    date.setDate(lastDay);\n  }\n  return date;\n};`
  },
  {
    title: "LRU Cache Implementation",
    language: "typescript",
    description: "Custom caching layer for high-concurrency booking endpoints.",
    code: `class LRUCache<T> {\n  private cache = new Map<string, T>();\n  constructor(private capacity: number) {}\n  get(key: string): T | null {\n    if (!this.cache.has(key)) return null;\n    const val = this.cache.get(key)!;\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n}`
  }
];