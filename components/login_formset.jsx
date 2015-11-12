Accounts.ui.LoginFormSet = React.createClass({
  render(){
    const options = {};

    if (this.props.redirect){
      options.redirect = this.props.redirect;
    }

    const services = getLoginServices() && !Meteor.user() ? <Accounts.ui.LoginServices {...options}/> : '';
    const form = Package['accounts-password'] ? <Accounts.ui.LoginForm {...options}/> : '';

    return(<div
      className="accounts-ui__formset">
        {services}
        {form && services ? <hr className="accounts-ui__separator"/> : ''}
        {form}
    </div>);
  }
});
