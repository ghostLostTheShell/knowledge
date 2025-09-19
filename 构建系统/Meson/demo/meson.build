project('么用的东西',
    version: '0.0.1',
    meson_version: '>= 0.49.0'
)

arg_env = get_option('env')
env = '当前环境@0@'.format(arg_env)


bin_config = configuration_data()
bin_config.set('application_name', '一个没的东西')
bin_config.set('env', env)


configure_file(
    input: 'object.in',
    output: 'object.json',
    configuration: bin_config,
    install_dir: get_option('bindir')
)

