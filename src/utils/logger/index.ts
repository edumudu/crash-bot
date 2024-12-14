import kleur from 'kleur'

const dateFormatter = new Intl.DateTimeFormat('en', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',

  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});


export const logger = {
  info(...args: unknown[]) {
    const timestamp = new Date()

    console.log(kleur.blue(`[${dateFormatter.format(timestamp)}]`), ...args);
  }
}
