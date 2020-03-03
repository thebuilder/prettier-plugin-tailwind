const prettierParserHTML = require('prettier/parser-html')
const TWClassesSorter = require('tailwind-classes-sorter').default

const twClassesSorter = new TWClassesSorter()

const language = {
  name: 'HTML',
  parsers: ['html'],
}

const parser = {
  ...prettierParserHTML.default.parsers.html,
  parse: (text, parsers, options) => {
    const result = prettierParserHTML.default.parsers.html.parse(
      text,
      parsers,
      options
    )
    const cleanElementClasses = el => {
      if (el.attrs) {
        const classAttr = el.attrs.find(attr => attr.name === 'class')
        if (classAttr) {
          const classList = classAttr.value
            .split(' ')
            .map(classItem => classItem.trim())
            .filter(classItem => classItem.length > 0)
          classAttr.value = twClassesSorter.sortClasslist(classList).join(' ')
        }
      }

      if (el.children && el.children.length > 0) {
        el.children.forEach(childEl => cleanElementClasses(childEl))
      }
    }
    cleanElementClasses(result)
    return result
  },
}

module.exports = {
  language,
  parser,
}
