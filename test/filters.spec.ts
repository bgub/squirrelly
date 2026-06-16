/* global it, expect, describe */

import { render, filters } from '../src'

filters.define('capitalize', function (str: string) {
  return str.toUpperCase()
})

describe('Simple render checks', () => {
  describe('render works', () => {
    it('Simple filter works', () => {
      expect(render('Hi {{it.name | capitalize}}', { name: 'Ada Lovelace' })).toEqual(
        'Hi ADA LOVELACE'
      )
    })
    it('Escaping works', () => {
      expect(render('{{it.html}}', { html: '<script>Malicious XSS</script>' })).toEqual(
        '&lt;script&gt;Malicious XSS&lt;/script&gt;'
      )
    })
    it('Unescaping with * works', () => {
      expect(render('{{ * it.html}}', { html: '<script>Malicious XSS</script>' })).toEqual(
        '<script>Malicious XSS</script>'
      )
    })
    it('Unescaping with | safe works', () => {
      expect(render('{{it.html | safe}}', { html: '<script>Malicious XSS</script>' })).toEqual(
        '<script>Malicious XSS</script>'
      )
    })
    it('Does not execute code from default filter names', () => {
      var globalWithInjected = global as typeof global & { sqrlDefaultFilterInjected?: boolean }
      globalWithInjected.sqrlDefaultFilterInjected = false
      var payload = "e')(), global.sqrlDefaultFilterInjected=true, c.l('F','e"

      expect(() =>
        render('{{it.name}}', { name: 'Ada Lovelace' }, { defaultFilter: payload })
      ).toThrow("Can't find filter")
      expect(globalWithInjected.sqrlDefaultFilterInjected).toBe(false)
    })
  })
})
