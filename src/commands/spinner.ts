
import { GluegunToolbox } from 'gluegun'


module.exports = {
  name: 'spinner',
  description: 'CLI to test spinner handling',
  hidden: true,
  run: async (toolbox: GluegunToolbox) => {
    await toolbox.helper.menu(toolbox, {
      level: 0,
      welcome: 'Spinner commands'
    });
    return;
  },
}
