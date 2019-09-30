
import { GluegunToolbox } from 'gluegun'


module.exports = {
  name: 'test',
  alias: ['t'],
  description: 'Test spinner',
  hidden: false,
  run: async (toolbox: GluegunToolbox) => {
    const spinner = toolbox.print.spin('Start');
    await toolbox.system.run('sleep 2');
    spinner.succeed('End');
    return;
  },
}
