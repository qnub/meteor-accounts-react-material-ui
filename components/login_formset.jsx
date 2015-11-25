Accounts.ui.LoginFormSet = React.createClass({
  render(){
    const options = {};

    if (this.props.redirect){
      options.redirect = this.props.redirect;
    }

    const services = getLoginServices().length && !Meteor.user() ? <Accounts.ui.LoginServices {...options}/> : null;
    const form = Package['accounts-password'] ? <Accounts.ui.LoginForm {...options}/> : null;

    return(<div
      className="accounts-ui__formset">
        {services}
        {form && services ? <hr className="accounts-ui__separator"/> : null}
        {form}
    </div>);
  }
});
