Package.describe({
  summary: 'React Material UI components for accounts.',
  version: '0.13.4_1',
  name: 'qnub:accounts-react-material-ui',
  git: 'https://github.com/qnub/meteor-accounts-react-material-ui.git',
});

Npm.depends({
  'externalify': '0.1.0',
  'react-tap-event-plugin': '0.2.1',
  'material-ui': '0.13.4'
});

DEFAULT_LANGUAGES = ['ar', 'zh_cn', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es',
  'es_ES', 'fa', 'fr', 'he', 'hr', 'hu', 'id', 'it', 'ja', 'kh', 'ko', 'pl', 'pt', 'pt_PT', 'ro',
  'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'vi', 'no_NB', 'nl', 'zh_tw', 'zh_hk'];

LANGUAGES = DEFAULT_LANGUAGES;
if(process.env.T9N_LANGUAGES) {
  LANGUAGES = process.env.T9N_LANGUAGES.split(',');
}
FILES = [];
for (var i = 0; i < LANGUAGES.length; i++) {
  FILES.push('t9n/' + LANGUAGES[i] + '.js');
}

Package.onUse(function(api, where) {
  api.versionsFrom('METEOR@1.2');

  api.use([
    'ejson@1.0.7',
    'underscore',
    'accounts-base',
    'ecmascript',
    'templating',  // required to auto inslude oauth services forms
    'react@0.14.1_1',
    'cosmos:browserify@0.9.2',
    'qnub:t9n@0.0.2'
  ]);

  api.imply('accounts-base');

  api.use('accounts-oauth', {weak: true});
  api.use('accounts-password', {weak: true});

  api.addFiles([
    'style/style.css',
    'lib/window.react.js'
  ], 'client');

  api.addFiles(FILES);

  // api.addAssets([
  //   'lib/react-material-ui.browserify.options.json'
  // ], [
  //   'client',
  //   'server'
  // ]);

  api.addFiles([
    'server/user-services.js'
  ], ['server']);

  api.addFiles([
    'lib/react-material-ui.browserify.options.json',
    'lib/react-material-ui.browserify.js',

    'lib/helpers.js',
    'lib/index.js',
    'lib/login_session.js',

    'components/display_name.jsx',
    'components/service_config.jsx',
    'components/login_service.jsx',
    'components/login_services.jsx',
    'components/login_form.jsx',
    'components/login_formset.jsx',
    'components/login_dialogs.jsx'
  ]);
});
