export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) {
    return { meta: {}, body: raw }
  }

  try {
    return {
      meta: JSON.parse(match[1]),
      body: raw.replace(/^---[\s\S]*?---\r?\n/, ''),
    }
  } catch (error) {
    // Fall through to the forgiving parser for older mixed JSON/YAML content.
  }

  const meta = {}
  const lines = match[1].replace(/^\s*{\s*/, '').replace(/\s*}\s*$/, '').split(/\r?\n/)

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const field = line.match(/^\s*"?([A-Za-z0-9_-]+)"?\s*:\s*(.*?)(,)?\s*$/)

    if (!field) {
      continue
    }

    const key = field[1]
    let value = field[2].trim()

    if (value === 'null') {
      meta[key] = ''
      continue
    }

    if (value === '>-' || value === '>' || value === '|') {
      const block = []
      while (index + 1 < lines.length && /^\s+/.test(lines[index + 1])) {
        index += 1
        block.push(lines[index].trim())
      }
      value = block.join(' ')
    }

    meta[key] = value.replace(/,$/, '').replace(/^['"]|['"]$/g, '')
  }

  return {
    meta,
    body: raw.replace(/^---[\s\S]*?---\r?\n/, ''),
  }
}
