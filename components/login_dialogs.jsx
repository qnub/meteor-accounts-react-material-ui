Accounts.ui.Dialogs = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    let resetPasswordToken = Meteor.isClient ? Accounts._loginButtonsSession.get('resetPasswordToken') : undefined;

    this.show(resetPasswordToken);

    return {
      resetPasswordToken: resetPasswordToken
    };
  },

  getInitialState(){
    return({
      message: '',
      updateDisabled: true
    });
  },

  show(resetPasswordToken){
    if (this.isMounted() && resetPasswordToken){
      this.refs.dialog.show();
    }
  },

  componentDidMount(){
    this.show(this.data.resetPasswordToken);
  },

  validatePassword(password){
    return validatePassword(password);
  },

  resetPassword() {
    let newPassword = this.refs.newPassword.getValue();

    if (!this.validatePassword(newPassword)){
      this.showMessage(t9n("error.pwTooShort"));

      return;
    }

    Accounts.resetPassword(
      this.data.resetPasswordToken,
      newPassword,
      (error)=>{
        if (error) {
          this.showMessage(t9n(`error.accounts.${error.reason}`) || t9n("Unknown error"));
        } else {
          this.showMessage(t9n('info.passwordChanged'));
          this.cancel();
        }
      }
    );
  },

  showMessage(message){
    message = message.trim();

    if (message){
      this.setState({message});
      this.refs.snackbar.show();
    }
  },

  cancel(){
    Accounts._loginButtonsSession.set('resetPasswordToken', null);
    this.refs.dialog.dismiss();
  },

  updateDisabled() {
    if (this.refs.dialog.isOpen()){
      this.setState({updateDisabled: this.refs.newPassword.getValue() === ''});
    }
  },

  render(){
    let actions = [
      <div
        key="cancelChangePassword"
        className="accounts-ui__button accounts-ui__button_variant_form accounts-ui__button_variant_dialog">
          <MUI.FlatButton
            label={t9n('cancel')}
            secondary={true}
            onTouchTap={this.cancel} />
      </div>,
      <div
        key="changePassword"
        className="accounts-ui__button accounts-ui__button_variant_form accounts-ui__button_variant_dialog">
          <MUI.FlatButton
            label={t9n('changePassword')}
            primary={true}
            onTouchTap={this.resetPassword}
            disabled={this.state.updateDisabled}/>
      </div>
    ];

    return(<div className="accounts-ui__dialogs">
      <MUI.Dialog
        ref="dialog"
        title={t9n('changePassword')}
        actions={actions}
        modal={true}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}>
          <div className="accounts-ui__field">
            <MUI.TextField
              key="newPassword"
              ref="newPassword"
              type="password"
              hintText={t9n('Enter password')}
              floatingLabelText={t9n('newPassword')}
              onChange={this.updateDisabled}/>
          </div>
      </MUI.Dialog>

      <MUI.Snackbar
        key="snackbar"
        ref="snackbar"
        message={this.state.message}
        autoHideDuration={2000}/>
    </div>);
  }
});
