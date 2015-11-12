Accounts.ui.LoginService = React.createClass({
  mixins: [ReactMeteorData],

  propTypes: {
    service: React.PropTypes.object.isRequired
  },

  getMeteorData(){
    return {
      service: ServiceConfiguration.configurations.findOne({service: this.props.service.name})
    };
  },

  configured() {
    return !!this.data.service;
  },

  capitalizedName() {
    if (this.props.service.name === 'github'){
      return 'GitHub';
    }else if (this.props.service.name === 'meteor-developer'){
      return 'Meteor';
    }else{
      return capitalize(this.props.service.name);
    }
  },

  styles(){
    try {
      return styles.services[this.props.service.name];
    } catch (e){
      return {};
    }
  },

  handleLogin(event){
    const serviceName = this.props.service.name;

    // XXX Service providers should be able to specify their
    // `Meteor.loginWithX` method name.
    const loginWithService = Meteor["loginWith" +
                                  (serviceName === 'meteor-developer' ?
                                   'MeteorDeveloperAccount' :
                                   capitalize(serviceName))];

    const options = {}; // use default scope unless specified

    if (Accounts.ui._options.requestPermissions[serviceName]){
      options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
    }

    if (Accounts.ui._options.requestOfflineToken[serviceName]){
      options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
    }

    if (Accounts.ui._options.forceApprovalPrompt[serviceName]){
      options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];
    }

    loginWithService(options, (err)=>{
      if (err){
        if (err.reason){
          this.showMessage(t9n(`error.accounts.${err.reason}`))
        } else {
          this.showMessage(t9n("Unknown error"))
          console.log(err);
        }
      } else {
        loginResultCallback(this.props.redirect);
      }
    });
  },

  handleConfig(){
    this.refs.config.show();
  },

  render(){
    let form = 'service';
    const serviceName = this.props.service.name;

    if (this.configured()){
      form = <MUI.RaisedButton
        key="serviceButton"
        id={`login-buttons-${serviceName}`}
        label={`${t9n('signIn')} ${t9n('with')} ${this.capitalizedName()}`}
        onTouchTap={this.handleLogin}
        {...this.styles()}/>
    }else{
      form = <MUI.RaisedButton
        key="serviceConfigButton"
        id={`login-buttons-${serviceName}`}
        label={`${t9n('configure')} ${this.capitalizedName()}`}
        onTouchTap={this.handleConfig}
        {...this.styles()}/>
    }

    return(<div
      className={`accounts-ui__button accounts-ui__button_variant_service accounts-ui__button_service_${serviceName}`}>
        {form}
        <Accounts.ui.ServiceConfig
          ref="config"
          service={this.props.service}/>
    </div>);
  }
});
