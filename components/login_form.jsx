const LOGIN_FORM_STATES = {
  SIGN_IN: Symbol('SIGN_IN'),
  SIGN_UP: Symbol('SIGN_UP'),
  PASSWORD_CHANGE: Symbol('PASSWORD_CHANGE'),
  PASSWORD_RESET: Symbol('PASSWORD_RESET')
};

Accounts.ui.LoginForm = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      user: Meteor.user()
    };
  },

  render(){
    if (!Package['accounts-password']){
      return false;
    }

    return(<div
      className="accounts-ui__form-wrapper">
      <Accounts.ui._loginForm user={this.data.user} {...this.props}/>
    </div>);
  }
});

Accounts.ui._loginForm = React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },

  getInitialState(){
    return {
      message: '',
      waiting: false,
      formVariant: this.props.user ? LOGIN_FORM_STATES.PASSWORD_CHANGE : LOGIN_FORM_STATES.SIGN_IN,
      services: []
    };
  },

  componentDidMount(){
    this.updatedServices();
  },

  updatedServices(){
    Meteor.call('userServices', (err, res)=>{
      if (!err && this.isMounted()){
        this.setState({
          services: res
        });
      }
    });
  },

  componentWillReceiveProps(nextProps){
    if (!nextProps.user && this.state.formVariant != LOGIN_FORM_STATES.SIGN_IN){
      this.setState({
        formVariant: LOGIN_FORM_STATES.SIGN_IN
      });
    }

    if (this.props.user != nextProps.user){
      this.updatedServices();
    }
  },

  validateUsername(username){
    if (username.length >= 3) {
      return true;
    } else {
      this.showMessage(t9n("error.usernameTooShort"));
      this.refs.snackbar.show();

      return false;
    }
  },

  validateEmail(email){
    if (passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL" && email === '')
      return true;

    if (email.indexOf('@') !== -1) {
      return true;
    } else {
      this.showMessage(t9n("error.emailInvalid"));

      return false;
    }
  },

  validatePassword(password){
    return validatePassword(password);
  },

  getField(key, ref, hint, label, type='text'){
    return(<div
      key={key}
      className="accounts-ui__field">
        <MUI.TextField
          ref={ref}
          type={type}
          hintText={hint}
          floatingLabelText={label}/>
    </div>);
  },

  getUsernameOrEmailField(){
    return(this.getField(
      'usernameOrEmail',
      'usernameOrEmail',
      t9n('Enter username or email'),
      t9n('usernameOrEmail')
    ));
  },

  getUsernameField(){
    return(this.getField(
      'username',
      'username',
      t9n('Enter username'),
      t9n('username')
    ));
  },

  getEmailField(){
    return(this.getField(
      'email',
      'email',
      t9n('Enter email'),
      t9n('email')
    ));
  },

  getPasswordField(){
    return(this.getField(
      'password',
      'password',
      t9n('Enter password'),
      t9n('password'),
      'password'
    ));
  },

  getNewPasswordField(){
    return(this.getField(
      'newPassword',
      'newPassword',
      t9n('Enter password'),
      t9n('newPassword'),
      'password'
    ));
  },

  fields() {
    const loginFields = [];

    if (this.state.formVariant == LOGIN_FORM_STATES.SIGN_IN){
      if(_.contains(["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL"],
                    passwordSignupFields())){
        loginFields.push(this.getUsernameOrEmailField());
      }

      if(passwordSignupFields() === "USERNAME_ONLY"){
        loginFields.push(this.getUsernameField());
      }

      if(passwordSignupFields() === "EMAIL_ONLY"){
        loginFields.push(this.getEmailField());
      }

      loginFields.push(this.getPasswordField());
    }

    if (this.state.formVariant == LOGIN_FORM_STATES.SIGN_UP){
      if(_.contains(["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY"],
                    passwordSignupFields())){
        loginFields.push(this.getUsernameField());
      }

      if(_.contains(["USERNAME_AND_EMAIL", "EMAIL_ONLY"],
                    passwordSignupFields())){
        loginFields.push(this.getEmailField());
      }

      loginFields.push(this.getPasswordField());
    }

    if (this.state.formVariant == LOGIN_FORM_STATES.PASSWORD_RESET){
      loginFields.push(this.getEmailField());
    }

    if (this.showPasswordChangeForm()){
      loginFields.push(this.getPasswordField());
      loginFields.push(this.getNewPasswordField());
    }

    return loginFields;
  },

  showPasswordChangeForm(){
    return(this.state.services.indexOf('password') != -1
      && this.state.formVariant == LOGIN_FORM_STATES.PASSWORD_CHANGE);
  },

  showCreateAccountLink() {
    return this.state.formVariant == LOGIN_FORM_STATES.SIGN_IN && !Accounts._options.forbidClientAccountCreation;
  },

  showForgotPasswordLink() {
    return !this.props.user
      && this.state.formVariant != LOGIN_FORM_STATES.PASSWORD_RESET
      && _.contains(
        ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "EMAIL_ONLY"],
        passwordSignupFields());
  },

  switchToSignUp(){
    this.setState({formVariant: LOGIN_FORM_STATES.SIGN_UP});
  },

  switchToSignIn(){
    this.setState({formVariant: LOGIN_FORM_STATES.SIGN_IN});
  },

  switchToPasswordReset(){
    this.setState({formVariant: LOGIN_FORM_STATES.PASSWORD_RESET});
  },

  signOut(){
    Meteor.logout();
  },

  signIn(){
    const username = this.refs.username ? this.refs.username.getValue().trim() : null;
    const email = this.refs.email ? this.refs.email.getValue().trim() : null;
    const usernameOrEmail = this.refs.usernameOrEmail ? this.refs.usernameOrEmail.getValue().trim() : null;
    // notably not trimmed. a password could (?) start or end with a space
    const password = this.refs.password.getValue();

    let loginSelector;

    if (username !== null) {
      if (!this.validateUsername(username)){
        return;
      } else {
        loginSelector = {username: username};
      }
    } else if (email !== null) {
      if (!this.validateEmail(email)){
        return;
      } else {
        loginSelector = {email};
      }
    } else if (usernameOrEmail !== null) {
      // XXX not sure how we should validate this. but this seems good enough (for now),
      // since an email must have at least 3 characters anyways
      if (!this.validateUsername(usernameOrEmail)){
        return;
      } else {
        loginSelector = usernameOrEmail;
      }
    } else {
      throw new Error("Unexpected -- no element to use as a login user selector");
    }

    Meteor.loginWithPassword(loginSelector, password, (error, result)=>{
      if (error) {
        this.showMessage(t9n(`error.accounts.${error.reason}`) || t9n("Unknown error"));
      } else {
        this.setState({formVariant: LOGIN_FORM_STATES.PASSWORD_CHANGE});
        loginResultCallback(this.props.redirect);
      }
    });
  },

  signUp(){
    const options = {}; // to be passed to Accounts.createUser

    const username = this.refs.username ? this.refs.username.getValue().trim() : null;
    const email = this.refs.email ? this.refs.email.getValue().trim() : null;
    // notably not trimmed. a password could (?) start or end with a space
    const password = this.refs.password.getValue();

    if (username !== null) {
      if (!this.validateUsername(username)){
        return;
      } else {
        options.username = username;
      }
    }

    if (email !== null) {
      if (!this.validateEmail(email)){
        return;
      } else {
        options.email = email;
      }
    }

    if (!this.validatePassword(password)){
      this.showMessage(t9n("error.pwTooShort"));

      return;
    } else {
      options.password = password;
    }

    this.setState({waiting: true});

    Accounts.createUser(options, (error)=>{
      if (error) {
        this.showMessage(t9n(`error.accounts.${error.reason}`) || t9n("Unknown error"));
      } else {
        this.setState({formVariant: LOGIN_FORM_STATES.PASSWORD_CHANGE});
        loginResultCallback(this.props.redirect);
      }

      this.setState({waiting: false});
    });
  },

  passwordReset(){
    if (this.state.waiting) {
      return;
    }

    const email = this.refs.email ? this.refs.email.getValue().trim() : '';

    if (email.indexOf('@') !== -1) {
      this.setState({waiting: true});

      Accounts.forgotPassword({email: email}, (error)=>{
        if (error){
          this.showMessage(t9n(`error.accounts.${error.reason}`) || t9n("Unknown error"));
        } else {
          this.showMessage(t9n("info.emailSent"));
        }

        this.setState({waiting: false});
      });
    } else {
      this.showMessage(t9n("error.emailInvalid"));
    }
  },

  passwordChange(){
    const oldPassword = this.refs.password.getValue();

    // notably not trimmed. a password could (?) start or end with a space
    const password = this.refs.newPassword.getValue();

    if (!this.validatePassword(password)){
      this.showMessage(t9n("error.pwTooShort"));

      return;
    }

    Accounts.changePassword(oldPassword, password, (error)=>{
      if (error) {
        this.showMessage(t9n(`error.accounts.${error.reason}`) || t9n("Unknown error"));
      } else {
        this.showMessage(t9n('info.passwordChanged'));
      }
    });
  },

  showMessage(message){
    message = message.trim();

    if (message){
      this.setState({message});
      this.refs.snackbar.show();
    }
  },

  loaderPosition(){
    let position = 120;

    if (Meteor.isClient){
      position = window.innerWidth / 2 - 20;
    }

    return position;
  },

  render(){
    // console.log(this.props.user);

    const signUpSwitch = this.showCreateAccountLink() ?
      <div
        key="signUpSwitch"
        className="accounts-ui__button accounts-ui__button_variant_form">
          <MUI.FlatButton
            ref="signUpSwitch"
            label={t9n('signUp')}
            onTouchTap={this.switchToSignUp}/>
      </div>
      : '';

    const signInSwitch = (this.state.formVariant == LOGIN_FORM_STATES.SIGN_UP
                        || this.state.formVariant == LOGIN_FORM_STATES.PASSWORD_RESET) ?
      <div
        key="signInSwitch"
        className="accounts-ui__button accounts-ui__button_variant_form">
          <MUI.FlatButton
            ref="signInSwitch"
            label={t9n('signIn')}
            onTouchTap={this.switchToSignIn}/>
      </div>
      : '';

    const passwordResetSwitch = this.showForgotPasswordLink() ?
      <div
        key="passwordResetSwitch"
        className="accounts-ui__button accounts-ui__button_variant_form">
          <MUI.FlatButton
            ref="passwordResetSwitch"
            label={t9n('resetYourPassword')}
            onTouchTap={this.switchToPasswordReset}/>
      </div>
      : '';

    const signInButton = this.state.formVariant == LOGIN_FORM_STATES.SIGN_IN ?
      <div
        key="signInButton"
        className="accounts-ui__button accounts-ui__button_variant_form">
          <MUI.RaisedButton
            ref="signInButton"
            secondary={true}
            label={t9n('signIn')}
            disabled={this.state.waiting}
            onTouchTap={this.signIn}/>
      </div>
      : '';

    const signUpButton = this.state.formVariant == LOGIN_FORM_STATES.SIGN_UP ?
      <div
        key="signUpButton"
        className="accounts-ui__button accounts-ui__button_variant_form">
          <MUI.RaisedButton
            ref="signUpButton"
            secondary={true}
            label={t9n('signUp')}
            disabled={this.state.waiting}
            onTouchTap={this.signUp}/>
      </div>
      : '';

    const passwordResetButton = this.state.formVariant == LOGIN_FORM_STATES.PASSWORD_RESET ?
      <div
        key="passwordResetButton"
        className="accounts-ui__button accounts-ui__button_variant_form">
          <MUI.RaisedButton
            ref="passwordResetButton"
            secondary={true}
            label={t9n('emailResetLink')}
            disabled={this.state.waiting}
            onTouchTap={this.passwordReset}/>
      </div>
      : '';

    const passwordChangeButton = this.showPasswordChangeForm() ?
      <div
        key="passwordChangeButton"
        className="accounts-ui__button accounts-ui__button_variant_form">
          <MUI.RaisedButton
            ref="passwordChangeButton"
            secondary={true}
            label={t9n('changePassword')}
            disabled={this.state.waiting}
            onTouchTap={this.passwordChange}/>
      </div>
      : '';

    const signOutButton = this.props.user ?
      <div
        key="signOutButton"
        className="accounts-ui__button accounts-ui__button_variant_form">
          <MUI.RaisedButton
            ref="signOutButton"
            secondary={true}
            label={t9n('signOut')}
            onTouchTap={this.signOut}/>
      </div>
      : '';

    return(<div
      className="accounts-ui__form">
        {this.fields()}
        <div className="accounts-ui__form-buttons">
          {signOutButton}
          {signUpSwitch}
          {signInSwitch}
          {passwordResetSwitch}
          {signUpButton}
          {signInButton}
          {passwordResetButton}
          {passwordChangeButton}
        </div>

        <MUI.RefreshIndicator
          size={40}
          left={this.loaderPosition()}
          top={120}
          status={this.state.waiting ? 'loading' : 'hide'} />
        <MUI.Snackbar
          ref="snackbar"
          message={this.state.message}
          autoHideDuration={2000}/>
    </div>);
  }
});
