Accounts.ui.LoginServices = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData(){
    return {
      services: getLoginServices(),
      configurationLoaded: Meteor.isClient ? Accounts.loginServicesConfigured() : false
    };
  },

  render(){
    let form = 'services';
    const options = {};

    if (this.props.redirect){
      options.redirect = this.props.redirect;
    }

    if (this.data.services && this.data.configurationLoaded){
      form = this.data.services.map((service, index)=>{
        const serviceOptions = {};

        return(<Accounts.ui.LoginService
          key={index}
          service={service}
          {..._.extend(options, serviceOptions)}/>);
      });
    }

    return(<div
      className="accounts-ui__services">
        {form}
    </div>);
  }
});
