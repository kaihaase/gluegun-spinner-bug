import { GluegunToolbox } from 'gluegun'

/**
 * Common helper functions
 */
export class Helper {
  /**
   * Constructor for integration of toolbox
   */
  constructor(protected toolbox: GluegunToolbox) {
  }

  /**
   * Menu
   */
  public async menu(
    toolbox: GluegunToolbox,
    options?: {
      level?: number;
      parentCommand?: string;
      welcome?: string;
    }
  ) {
    // Toolbox feature
    const {
      helper,
      print,
      prompt,
      runtime: { commands, brand }
    } = toolbox

    // Prepare parent command
    const pC = options.parentCommand ? options.parentCommand.trim() : ''

    // Process options
    const { level, parentCommand, welcome } = Object.assign(
      {
        level: pC ? pC.split(' ').length : 0,
        parentCommand: '',
        welcome: pC ? pC.charAt(0).toUpperCase() + pC.slice(1) + ' commands' : ''
      },
      options
    )

    // Welcome
    if (welcome) {
      print.info(print.colors.cyan(welcome))
    }

    // Get main commands
    let mainCommands = commands
      .filter(
        (c) =>
          c.commandPath.length === level + 1 &&
          c.commandPath.join(' ').startsWith(parentCommand) &&
          ![brand, 'help'].includes(c.commandPath[0])
      )
      .map((c) => c.commandPath[level] + (c.description ? ` (${c.description})` : ''))
      .sort()

    // Additions commands
    mainCommands = ['[ help ]'].concat(mainCommands)
    if (level) {
      mainCommands.push('[ back ]')
    }
    mainCommands.push('[ cancel ]')

    // Select command
    const { commandName } = await prompt.ask({
      type: 'select',
      name: 'commandName',
      message: 'Select command',
      choices: mainCommands.slice(0)
    })

    // Check command
    if (!commandName) {
      print.error('No command selected!')
      return
    }

    switch (commandName) {
      case '[ back ]': {
        await helper.commandSelector(toolbox, {
          parentCommand: parentCommand.substr(0, parentCommand.lastIndexOf(' '))
        })
        return
      }
      case '[ cancel ]': {
        print.info('Take care 👋')
        return
      }
      case '[ help ]': {
        (print.printCommands as any)(toolbox, level ? parentCommand.split(' ') : undefined)
        break
      }
      default: {
        // Get command
        const command = commands.filter(
          (c) => c.commandPath.join(' ') === `${parentCommand} ${commandName}`.trim().replace(/\s\(.*\)$/, '')
        )[0]

        // Run command
        try {
          await command.run(toolbox)
          // process.exit()
        } catch (e) {
          // Abort via CTRL-C
          if (!e) {
            console.log('Goodbye ✌️')
          } else {
            // Throw error
            throw e
          }
        }
      }
    }
  }
}

/**
 * Extend toolbox
 */
export default (toolbox: GluegunToolbox) => {
  toolbox.helper = new Helper(toolbox)
};
