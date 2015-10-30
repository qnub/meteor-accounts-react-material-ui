getLoginServices = function(){
  // First look for OAuth services.
  const services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : [];

  // Be equally kind to all login services. This also preserves
  // backwards-compatibility. (But maybe order should be
  // configurable?)
  services.sort();

  // Add password, if it's there; it must come last.
  // if (hasPasswordService())
  //   services.push('password');

  return _.map(services, function(name){
    return {name: name};
  });
};

loginResultCallback = function (redirect) {
  if (Meteor.isClient){
    if (typeof redirect === 'string'){
      window.location.href = redirect;
    }

    if (typeof redirect === 'function'){
      redirect();
    }
  }
};

capitalize = function(str){
  str = str == null ? '' : String(str);

  return str.charAt(0).toUpperCase() + str.slice(1);
};

passwordSignupFields = function () {
  return Accounts.ui._options.passwordSignupFields || "EMAIL_ONLY";
};

validatePassword = function(password){
  if (password.length >= 6) {
    return true;
  } else {
    return false;
  }
};

let defaultStyles = {
  container: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  headline: {
    fontSize: '24px',
    lineHeight: '32px',
    paddingTop: '16px',
    marginBottom: '12px',
    letterSpacing: '0',
    fontWeight: MUI.Styles.Typography.fontWeightNormal,
    color: MUI.Styles.Typography.textDarkBlack,
  },
};

try {
  styles = _.extend(defaultStyles, Meteor.settings.public.accounts.styles);
} catch(e){
  styles = defaultStyles
}
